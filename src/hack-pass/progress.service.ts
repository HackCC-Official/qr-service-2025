import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { AccountService } from "src/account/account.service";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { ProgressSelect } from "src/drizzle/schema/hack-pass";
import { RequestActivityAccountDTO } from "./request-activity.dto";
import { point } from "drizzle-orm/pg-core";

@Injectable()
export class ProgressService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(ProgressService.name)
    private readonly logger: PinoLogger,
    private accountService: AccountService
  ) {}

  // get progress by account_id
  async getProgressByAccountId(account_id: string): Promise<ProgressSelect> {
    return this.db
      .query
      .progresses
      .findFirst({ where: eq(schema.progresses.account_id, account_id)})
  }

  // create progress
  async createProgress(account_id: string): Promise<ProgressSelect> {
    const [progress] = await this.db
      .insert(schema.progresses)
      .values({
        account_id,
        points: 0,
      })
      .returning();

    return progress
  }

  // reward progress
  async rewardProgress(account_id: string, activity: RequestActivityAccountDTO): Promise<ProgressSelect> {
    // get progress
    let progress = await this.getProgressByAccountId(account_id);
    
    // if progress doesn't exist
    if (!progress) {
      progress = await this.createProgress(account_id);
      this.logger.info({ msg: 'Creating progress with id' + progress.id + 'for account_id ' + account_id})
    }

    // add reward to progress
    const [rewardedProgress] = await this
      .db
      .update(schema.progresses)
      .set({
        points: progress.points + activity.reward
      })
      .where(eq(schema.progresses.account_id, account_id))
      .returning();

    this.logger.info({ msg: 'Rewarding progress', rewardedProgress });
    
    return rewardedProgress;
  }
}