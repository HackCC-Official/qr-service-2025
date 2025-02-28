import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { AttendanceStatus } from "src/drizzle/schema/attendance";

export class AttendanceQueryParamDTO {
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
  
  @IsUUID()
  @IsOptional()
  event_id?: string;
}