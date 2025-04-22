import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { WorkshopSelect } from "src/drizzle/schema/workshop";
import { Type } from 'class-transformer';
import { AccountDTO } from "src/account/account.dto";

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

  @ApiProperty({
    example: [
      {
        id: "43c11165-1e18-493f-8b95-e214314f9525",
        email: "eangchheangly@gmail.com",
        firstName: "Evan",
        lastName: "Ly",
        roles: [
            "ADMIN"
        ],
        createdAt: "2025-03-08T00:50:55.170Z",
        deletedAt: null
      }
    ]
  })
  @IsArray()
  @Type(() => AccountDTO)
  organizers: AccountDTO[];
}