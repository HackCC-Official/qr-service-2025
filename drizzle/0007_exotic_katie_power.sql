ALTER TABLE "activities" ADD COLUMN "account_id" uuid;--> statement-breakpoint
ALTER TABLE "progresses" ADD CONSTRAINT "progresses_account_id_unique" UNIQUE("account_id");