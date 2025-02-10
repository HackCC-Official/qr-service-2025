import { ApiProperty } from "@nestjs/swagger";
import { relations } from "drizzle-orm";
import { pgTable, uuid, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { attendances } from "./attendance";
import { meals } from "./meal";

export const events = pgTable('events', {
  id: uuid().defaultRandom().primaryKey(),
  date: date(),
  startingTime: timestamp({ withTimezone: true, mode: 'string' }),
  lateTime: timestamp({ withTimezone: true, mode: 'string' }),
  endingTime: timestamp({ withTimezone: true, mode: 'string' }),
  active: boolean(),
  breakfast: boolean(),
  lunch: boolean(),
  dinner: boolean(),
})

export const eventsRelationships = relations(events, ({ many }) => ({
  attendances: many(attendances),
  meals: many(meals)
}))

export type EventSelect = typeof events.$inferSelect;
export type EventInsert = typeof events.$inferInsert;