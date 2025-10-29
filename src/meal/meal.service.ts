import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { AccountService } from "src/account/account.service";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { EventService } from "src/event/event.service";
import { RequestMealDTO } from "./request-meal.dto";
import { and, eq } from "drizzle-orm";
import { ResponseMealDTO } from "./response-meal.dto";
import { MealType } from "src/drizzle/schema/meal";
import { ResponseMealAccountDTO } from "./response-meal-account.dto";
import { MealQueryParamDTO } from "./meal-query-param.dto";
import { AccountDTO } from "src/account/account.dto";

@Injectable()
export class MealService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(MealService.name)
    private readonly logger: PinoLogger,
    private eventService: EventService,
    private accountService: AccountService
  ) {}

  getMealType(currentHour: number) {
    return currentHour >= 6 && currentHour < 11 ?
    MealType.BREAKFAST
    :
    currentHour >= 11 && currentHour <= 14
    ?
    MealType.LUNCH
    :
    MealType.DINNER;
  }

  isTodayPST(dateStr: string): boolean {
    const todayPST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    
    const dateStrPST = new Date(dateStr + "T00:00:00-08:00"); 
    
    return todayPST.toDateString() === dateStrPST.toDateString()
  }

  getHourAtPST(date: Date = new Date()) {
    const format = new Intl.DateTimeFormat('en', {hour: '2-digit', hour12: false, timeZone: 'America/Los_Angeles' })
    return Number(format.formatToParts(date)[0].value)
  }

  async findByEventIDAndAccountID(event_id: string, account_id: string) : Promise<ResponseMealDTO> {
    return this.db
      .query
      .meals
      .findFirst({ where: and(eq(schema.meals.event_id, event_id), eq(schema.meals.account_id, account_id)) });
  }

  async findByAccountIDAndEventIdAndMealType(account_id: string, event_id: string, mealType: MealType) : Promise<ResponseMealAccountDTO> {
    console.log(account_id)
    const account = await this.accountService.findById(account_id);
    const meal = await this.db
      .query
      .meals
      .findFirst({ where: and(eq(schema.meals.account_id, account_id), eq(schema.meals.event_id, event_id), eq(schema.meals.mealType, mealType)) });

    if (!meal) {
      return {
        id: '',
        account,
        event_id: event_id,
        mealType: MealType.UNCLAIMED,
        checkedInAt: null
      }
    }

    return {
      id: meal.id,
      event_id: meal.event_id,
      mealType: meal.mealType,
      checkedInAt: meal.checkedInAt,
      account
    }
  }

  async findByEventID(event_id: string) : Promise<ResponseMealDTO[]> {
    return this.db
      .query
      .meals
      .findMany({ where: eq(schema.meals.event_id, event_id) });
  }

  async claimMeal(requestMealDTO: RequestMealDTO): Promise<ResponseMealDTO> {
    const event = await this.eventService.findById(requestMealDTO.event_id);
    const account = await this.accountService.findById(requestMealDTO.account_id);
    const mealExists = await this.findByEventIDAndAccountID(requestMealDTO.event_id, requestMealDTO.account_id);

    if (mealExists) {
      this.logger.error("Account with ID " + requestMealDTO.account_id + " already claimed meal.");
      throw new Error("Account with ID " + requestMealDTO.account_id + " already claimed meal.");
    }

    if (!event) {
      this.logger.error("Event ID " + requestMealDTO.event_id + " doesn't exist.")
      throw new Error("Event ID " + requestMealDTO.event_id + " doesn't exist.");
    }

    if (!account) {
      this.logger.error("Account ID " + requestMealDTO.account_id + " doesn't exist.")
      throw new Error("Account ID " + requestMealDTO.account_id + " doesn't exist.");
    }

    const currentHour = this.getHourAtPST();
    const mealType = this.getMealType(currentHour);

    const mealDTO = {
      event_id: requestMealDTO.event_id,
      account_id: requestMealDTO.account_id,
      checkedInAt: (new Date()).toISOString(),
      mealType
    }

    const isValidCheckInTime = this.eventService.isValidCheckInTime(mealDTO.checkedInAt, event)
    
    if (!isValidCheckInTime) {
      this.logger.info({ msg: 'Invalid meal check in time for Account ID: ' + mealDTO.account_id, mealDTO, event })
      return;
    } else {
      const [meal] = await this.db
      .insert(schema.meals)
      .values(mealDTO)
      .returning()

      this.logger.info({ msg: 'meal claimed', mealDTO })

      return meal;
    }
  }

  async findAll(query?: MealQueryParamDTO): Promise<ResponseMealAccountDTO[]> {
    const whereConditions = [];

    const containsPhantomMeals = query.mealType === MealType.ALL || query.mealType === MealType.UNCLAIMED

    if (!containsPhantomMeals) {
      whereConditions.push(eq(schema.meals.mealType, query.mealType))
    }

    if (query.event_id !== undefined) {
      whereConditions.push(eq(schema.meals.event_id, query.event_id));
    }

    const meals = await this.db
      .query
      .meals
      .findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined
      })

    const account_ids = meals.map(meal => meal.account_id)
    let accounts: AccountDTO[];

    if (!containsPhantomMeals) {
      accounts = account_ids.length > 0 ? await this.accountService.batchFindById(account_ids) : [];
    } else {
      accounts = await this.accountService.findAll();
    }

    if (!containsPhantomMeals) {
      const account_map = {};
      for (const account of accounts) {
        account_map[account.id] = account;
      }
      return meals.map((m) => {
        const account_id = m.account_id as string
        delete m.account_id
        return {
          ...m,
          account: account_map[account_id]
        }
      })
    } else if (query.mealType === MealType.ALL) {
      const account_map = {}

      for (const account of accounts) {
        account_map[account.id] = account
      }

      const claimedAccountSet = new Set();

      for (const account_id of account_ids) {
        claimedAccountSet.add(account_id);
      }

      const unclaimedAccounts = accounts.filter(a => !claimedAccountSet.has(a.id))
      return [
        ...meals.map((m) => {
          const account_id = m.account_id as string
          delete m.account_id
          return {
            ...m,
            account: account_map[account_id]
          }
        })
        ,
        ...unclaimedAccounts.map(a => ({
          mealType: MealType.UNCLAIMED,
          id: a.id,
          account: a,
          event_id: query.event_id || '',
          checkedInAt: ''
        }))
      ]
    } else {
      const unclaimedAccountSet = new Set();

      for (const account_id of account_ids) {
        unclaimedAccountSet.add(account_id)
      }

      const validAccounts = accounts.filter(a => !unclaimedAccountSet.has(a.id))
      
      return validAccounts.map(a => ({
        mealType: MealType.UNCLAIMED,
        id: a.id,
        account: a,
        event_id: query.event_id || '',
        checkedInAt: ''
      }))
    }
  }
}