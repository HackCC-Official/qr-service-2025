import { IsOptional, IsUUID } from "class-validator";

export class WorkshopAttendanceQueryParamDTO {
  @IsUUID()
  @IsOptional()
  event_id?: string;

  @IsUUID()
  @IsOptional()
  workshop_id?: string;

  @IsUUID()
  @IsOptional()
  account_id?: string;
}