import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsString } from "class-validator";
import { WorkshopInsert } from "src/drizzle/schema/workshop";

export class RequestWorkshopDTO implements WorkshopInsert {
  @ApiProperty({
    example: 'Workshop A'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A description for Workshop A'
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Costa Mesa, CA'
  })
  @IsNotEmpty()
  @IsString()
  location: string;
}