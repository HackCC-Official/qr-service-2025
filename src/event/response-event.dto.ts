import { IsBoolean, IsDate, IsDateString, IsUUID } from "class-validator";

export class ResponseEventDTO {
  @IsUUID()
  id: string;

  @IsDate()
  date: Date;

  @IsDateString()
  startingTime: Date;

  @IsDateString()
  endingTime: Date;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  breakfast: boolean;

  @IsBoolean()
  lunch: boolean;

  @IsBoolean()
  dinner: boolean;
}