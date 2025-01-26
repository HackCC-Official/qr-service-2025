import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const accountQRs = pgTable('account-qrs', {
  id: uuid().defaultRandom().primaryKey(),
  url: varchar(),
  account_id: varchar(),
})

export type ResponseAccountQRDTO = typeof accountQRs.$inferSelect;
export type RequestAccountQRDTO = typeof accountQRs.$inferInsert;