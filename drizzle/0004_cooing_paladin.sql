ALTER TYPE "public"."mealType" ADD VALUE 'UNCLAIMED';--> statement-breakpoint
CREATE TABLE "workshop_attendances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" varchar,
	"event_id" varchar,
	"workshop_id" varchar,
	"checkedInAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "workshop_organizers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" varchar,
	"workshop_id" varchar
);
--> statement-breakpoint
CREATE TABLE "workshops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"description" text,
	"location" text
);
