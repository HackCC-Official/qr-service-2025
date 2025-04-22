import { accountQRs } from "./account-qr";
import { attendances, attendancesRelationship } from "./attendance";
import { events, eventsRelationships } from "./event";
import { meals, mealsRelationship } from "./meal";
import { workshop_attendances, workshop_attendancesRelationship, workshop_organizers, workshop_organizersRelationship, workshops, workshopsRelationship } from "./workshop";

export const schema = { 
  events, 
  accountQRs, 
  attendances, 
  meals, 
  workshops,
  workshop_organizers,
  workshop_attendances,
  workshopsRelationship,
  workshop_attendancesRelationship,
  workshop_organizersRelationship,
  mealsRelationship,
  eventsRelationships,
  attendancesRelationship
 } 