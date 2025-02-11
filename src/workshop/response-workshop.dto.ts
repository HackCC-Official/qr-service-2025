import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { WorkshopSelect } from "src/drizzle/schema/workshop";

export class ResponseWorkshopDTO implements WorkshopSelect {
  @ApiProperty({
    example: '53d627c1-4a66-4a5b-9c9d-e13c2b36a0ba'
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'Workshop A'
  })
  @IsUUID()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A description for Workshop A'
  })
  @IsUUID()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Costa Mesa, CA'
  })
  @IsUUID()
  @IsNotEmpty()
  location: string;
}