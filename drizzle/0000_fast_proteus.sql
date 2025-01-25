CREATE TABLE "account-qrs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" varchar,
	"account_id" varchar
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date,
	"startingTime" timestamp,
	"lateTime" timestamp,
	"endingTime" timestamp,
	"active" boolean,
	"breakfast" boolean,
	"lunch" boolean,
	"dinner" boolean
);
