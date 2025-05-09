import { ApiProperty } from "@nestjs/swagger";
import { WorkshopOrganizerInsert } from "src/drizzle/schema/workshop";

export class RequestWorkshopOrganizerDTO implements WorkshopOrganizerInsert {
  @ApiProperty({
    example: 'c369a73b-983e-4d36-9e1f-cae366a00e6f'
  })
  workshop_id: string;

  @ApiProperty({
    example: '6a42c5e9-8d82-43bc-9524-2e49f27875e1'
  })
  account_id: string;
}