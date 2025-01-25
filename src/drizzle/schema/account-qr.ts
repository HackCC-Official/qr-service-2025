import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const accountQRs = pgTable('account-qrs', {
  id: uuid().defaultRandom().primaryKey(),
  url: varchar(),
  account_id: varchar(),
})

export type ResponseQRAccountDTO = typeof accountQRs.$inferSelect;
export type RequestQRAccountDTO = typeof accountQRs.$inferInsert;