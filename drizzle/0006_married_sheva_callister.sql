CREATE TYPE "public"."origin" AS ENUM('WORKSHOP', 'MEAL', 'ATTENDANCE');--> statement-breakpoint
ALTER TYPE "public"."mealType" ADD VALUE 'ALL';--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"message" varchar NOT NULL,
	"rewards" integer,
	"origin" "origin",
	"rewardedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "progresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"points" integer
);
