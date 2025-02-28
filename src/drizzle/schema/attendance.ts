import { relations } from "drizzle-orm";
import { timestamp, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { enumToPgEnum } from "src/utils/drizzle";
import { events } from "./event";

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  ALL = 'ALL'
}

export const AttendanceStatusEnum = pgEnum('status', enumToPgEnum(AttendanceStatus))

export const attendances = pgTable('attendances', {
  id: uuid().defaultRandom().primaryKey(),
  status: AttendanceStatusEnum(),
  account_id: varchar(),
  event_id: varchar(),
  checkedInAt: timestamp({ withTimezone: true, mode: 'string' })
})

export const attendancesRelationship = relations(attendances, ({ one }) => ({
  event: one(events, {
    fields: [attendances.event_id],
    references: [events.id]
  })
}))

export type AttendanceSelect = typeof attendances.$inferSelect;
export type AttendanceInsert = typeof attendances.$inferInsert;