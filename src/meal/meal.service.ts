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

  async findUsersByEventIDAndStatus(query: MealQueryParamDTO): Promise<ResponseMealAccountDTO[]> {
    const { event_id, mealStatus } = query;
    let meals: ResponseMealAccountDTO[] = [];
    const event = await this.eventService.findById(event_id);

    if (!mealStatus) {
      // get currentHour and MealStatus
      const currentHour = this.getHourAtPST();
      const currentMealStatus = this.getMealType(currentHour);

      // if it's today, get meal by event_id and currentMealStatus
      // otherwise get it only by event_id
      const mealsObj =
        this.isTodayPST(event.date)
        ?
        await this
        .db
        .query
        .meals
        .findMany({ 
          where: and(
            eq(schema.meals.event_id, event_id),
            eq(schema.meals.mealType, currentMealStatus)
          ) 
        })
        :
        await this
        .db
        .query
        .meals
        .findMany({ 
          where: and(
            eq(schema.meals.event_id, event_id)
          ) 
        })
      
      // get invalid account_ids, we want to find accounts
      // that have not claimed any meals for current meal status
      // for today OR any meals at all
      const invalid_account_ids = mealsObj.map(m => m.account_id);
      const invalid_account_sets = new Set(invalid_account_ids);

      const accounts = (await this.accountService
        .findAll())
        .filter(a => !invalid_account_sets.has(a.id))

      meals = accounts.map(account => {
        return {
          id: '',
          account,
          event_id,
          mealType: MealType.UNCLAIMED,
          checkedInAt: 'N/A',
        }
      })


    } else
    {
      // get all meal status by event_id and type
      const mealsObj = await this
      .db
      .query
      .meals
      .findMany({ 
        where: and(
          eq(schema.meals.event_id, event_id),
          eq(schema.meals.mealType, mealStatus)
        ) 
      })

      const account_ids = mealsObj.map(m => m.account_id);
      const accounts = await this.accountService.batchFindById(account_ids)
      const account_map = {}

      accounts.forEach(a => {
        account_map[a.id] = a;
      })

      meals = mealsObj.map(m => ({
        ...m,
        account: account_map[m.account_id]
      }))
    }

    return meals;
  }
}