import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [DrizzleModule]
})
export class WorkshopModule {}