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

  async claimMeal(requestMealDTO: RequestMealDTO): Promise<ResponseMealDTO> {
    const event = await this.eventService.findById(requestMealDTO.event_id);
    const account = await this.eventService.findById(requestMealDTO.account_id);
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

    const mealType = 
      currentHour >= 6 && currentHour < 11 ?
        MealType.BREAKFAST
        :
        currentHour >= 11 && currentHour <= 14
        ?
        MealType.LUNCH
        :
        MealType.DINNER;

    const mealDTO = {
      event_id: requestMealDTO.event_id,
      account_id: requestMealDTO.account_id,
      checkedInAt: (new Date()).toISOString(),
      mealType
    }
    
    if (!this.eventService.isValidCheckInTime(mealDTO.checkedInAt, event)) {
      this.logger.info({ msg: 'Invalid meal check in time for Account ID: ' + mealDTO.account_id, mealDTO, event })
      return;
    }

    console.log(!this.eventService.isValidCheckInTime(mealDTO.checkedInAt, event), 'RAN')

    const [meal] = await this.db
      .insert(schema.meals)
      .values(mealDTO)
      .returning()

      this.logger.info({ msg: 'meal claimed', mealDTO })

      return meal;
  }
}