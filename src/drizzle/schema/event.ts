import { ApiProperty } from "@nestjs/swagger";
import { relations } from "drizzle-orm";
import { pgTable, uuid, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { attendances } from "./attendance";

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

export const eventsRelationships = relations(events, ({ many }) => ({
  attendances: many(attendances)
}))

export type EventSelect = typeof events.$inferSelect;
export type EventInsert = typeof events.$inferInsert;