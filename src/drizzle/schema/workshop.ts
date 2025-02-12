import { relations } from "drizzle-orm";
import { pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { events } from "./event";

export const workshops = pgTable('workshops', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar(),
  description: text(),
  location: text(),
})

export const workshopsRelationship = relations(workshops, ({ many }) => ({
  workshop_organizers: many(workshop_organizers),
  workshop_attendances: many(workshop_attendances)
}))

export type WorkshopSelect = typeof workshops.$inferSelect;
export type WorkshopInsert = typeof workshops.$inferInsert;

export const workshop_organizers = pgTable('workshop_organizers', {
  id: uuid().defaultRandom().primaryKey(),
  account_id: varchar(),
  workshop_id: varchar()
})

export const workshop_organizersRelationship = relations(workshop_organizers, ({ one }) => ({
  workshop: one(workshops, {
    fields: [workshop_organizers.workshop_id],
    references: [workshops.id]
  })
}))

export type WorkshopOrganizerSelect = typeof workshops.$inferSelect;
export type WorkshopOrganizerInsert = typeof workshops.$inferInsert;

export const workshop_attendances = pgTable('workshop_attendances', {
  id: uuid().defaultRandom().primaryKey(),
  account_id: varchar(),
  event_id: varchar(),
  workshop_id: varchar(),
  checkedInAt: timestamp({ withTimezone: true, mode: 'string' })
})

export const workshop_attendancesRelationship = relations(workshop_attendances, ({ one }) => ({
  workshop: one(workshops, {
    fields: [workshop_attendances.workshop_id],
    references: [workshops.id]
  }),
  event: one(events, {
    fields: [workshop_attendances.event_id],
    references: [events.id]
  })
}))

export type WorkshopAttendanceSelect = typeof workshop_attendances.$inferSelect;
export type WorkshopAttendanceInsert = typeof workshop_attendances.$inferInsert;