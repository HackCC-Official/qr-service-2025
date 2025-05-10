import { integer, pgEnum, pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { enumToPgEnum } from "src/utils/drizzle";

export const progresses = pgTable('progresses', {
  id: uuid().defaultRandom().primaryKey(),
  account_id: uuid(),
  points: integer()
})

export type ProgressSelect = typeof progresses.$inferSelect;
export type ProgressInsert = typeof progresses.$inferInsert;

export enum ActivityOrigin {
  WORKSHOP = 'WORKSHOP',
  MEAL = 'MEAL',
  ATTENDANCE = 'ATTENDANCE'
}

export const ActivityOriginEnum = pgEnum('origin', enumToPgEnum(ActivityOrigin))

export const activities = pgTable('activities', {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar().notNull(),
  message: varchar().notNull(),
  rewards: integer(),
  origin: ActivityOriginEnum(),
  rewardedAt: timestamp({ withTimezone: true, mode: 'string' })
})

export type ActivitySelect = typeof activities.$inferSelect
export type ActivityInsert = typeof activities.$inferInsert