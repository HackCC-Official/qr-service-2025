CREATE TYPE "public"."status" AS ENUM('PRESENT', 'LATE');--> statement-breakpoint
CREATE TABLE "attendances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "status",
	"account_id" varchar,
	"event_id" varchar,
	"checkedInAt" timestamp
);
