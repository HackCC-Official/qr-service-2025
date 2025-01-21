import { boolean, date, timestamp } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const events = pgTable('events', {
  id: uuid().defaultRandom().primaryKey(),
  date: date(),
  startingTime: timestamp({ mode: 'string' }),
  lateTime: timestamp({ mode: 'string' }),
  endingTime: timestamp({ mode: 'string' }),
  active: boolean(),
  breakfast: boolean(),
  lunch: boolean(),
  dinner: boolean(),
})

export type ResponseEventDTO = typeof events.$inferSelect;
export type RequestEventDTO = typeof events.$inferInsert;
