import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty,IsString } from "class-validator";
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

  @ApiProperty({
    example: ['f32b54d9-c17a-4eed-b6e4-fc0e26e1a21b']
  })
  @IsArray()
  @IsString({ each: true })
  organizers: string[];
}