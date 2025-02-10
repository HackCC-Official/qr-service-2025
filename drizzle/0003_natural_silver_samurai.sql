CREATE TYPE "public"."mealType" AS ENUM('BREAKFAST', 'LUNCH', 'DINNER');--> statement-breakpoint
CREATE TABLE "meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" varchar,
	"event_id" varchar,
	"mealType" "mealType",
	"checkedInAt" timestamp with time zone
);
