import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { AccountService } from "src/account/account.service";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { ProgressService } from "./progress.service";
import { ActivitySelect } from "src/drizzle/schema/hack-pass";
import { eq } from "drizzle-orm";
import { RequestActivityAccountDTO } from "./request-activity.dto";

@Injectable()
export class ActivityService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(ActivityService.name)
    private readonly logger: PinoLogger,
    private progressService: ProgressService,
    private accountService: AccountService
  ) {}

  // get activities by account_id
  async getActivitiesByAccountId(account_id: string): Promise<ActivitySelect[]> {
    return this.db
      .query
      .activities
      .findMany({ where: eq(schema.activities.account_id, account_id)});
  }

  // rewardActivity
  async rewardActivity(account_id: string, activity: RequestActivityAccountDTO): Promise<ActivitySelect> {
    // check if account exists
    const account = this.accountService.findById(account_id);

    // if account doesn't exist
    if (!account) {
      throw new Error('account with id ' + account_id + ' not found');
    }

    // use transaction and return activity
    const createdActivity = this.db.transaction(async tx => {
      // create activity first
      const [createdActivityObj] = await tx
        .insert(schema.activities)
        .values({
          ...activity
        })
        .returning();

      // reward progress
      this.progressService.rewardProgress(tx, account_id, createdActivityObj);
      
      // return createdActivityObj
      return createdActivityObj
    })

    this.logger.info({ msg: 'created activity', createdActivity })

    return createdActivity
  }
}