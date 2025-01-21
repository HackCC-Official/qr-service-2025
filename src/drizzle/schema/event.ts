import { boolean, date, timestamp } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const events = pgTable('events', {
  id: uuid().defaultRandom().primaryKey(),
  date: date(),
  startingTime: timestamp(),
  lateTime: timestamp(),
  endingTime: timestamp(),
  active: boolean(),
  breakfast: boolean(),
  lunch: boolean(),
  dinner: boolean(),
})

export type ResponseEventDto = typeof events.$inferSelect;
export type RequestEventDto = typeof events.$inferInsert;
