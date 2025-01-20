CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date,
	"startingTime" timestamp,
	"lateTime" timestamp,
	"endignTime" timestamp,
	"active" boolean,
	"breakfast" boolean,
	"lunch" boolean,
	"dinner" boolean
);
