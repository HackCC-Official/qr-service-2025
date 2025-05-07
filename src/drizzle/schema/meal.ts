import { relations } from "drizzle-orm";
import { pgTable, varchar, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { enumToPgEnum } from "src/utils/drizzle";
import { events } from "./event";

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  UNCLAIMED = 'UNCLAIMED',
  ALL = 'ALL',
}

export const MealTypeEnum = pgEnum('mealType', enumToPgEnum(MealType))

export const meals = pgTable('meals', {
  id: uuid().defaultRandom().primaryKey(),
  account_id: varchar(),
  event_id: varchar(),
  mealType: MealTypeEnum(),
  checkedInAt: timestamp({ withTimezone: true, mode: 'string' })
})

export const mealsRelationship = relations(meals, ({ one }) => ({
  event: one(events, {
    fields: [meals.event_id],
    references: [events.id]
  })
}))

export type MealSelect = typeof meals.$inferSelect;
export type MealInsert = typeof meals.$inferInsert;