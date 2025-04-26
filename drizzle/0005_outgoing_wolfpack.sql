ALTER TYPE "public"."status" ADD VALUE 'ABSENT';--> statement-breakpoint
ALTER TYPE "public"."status" ADD VALUE 'ALL';--> statement-breakpoint
ALTER TABLE "workshop_organizers" ALTER COLUMN "workshop_id" SET DATA TYPE uuid USING "workshop"::uuid;
ALTER TABLE "workshop_organizers" ADD CONSTRAINT "workshop_organizers_workshop_id_workshops_id_fk" FOREIGN KEY ("workshop_id") REFERENCES "public"."workshops"("id") ON DELETE no action ON UPDATE no action;