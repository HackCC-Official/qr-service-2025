import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { WorkshopService } from "./workshop.service";
import { ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { ResponseWorkshopDTO } from "./response-workshop.dto";
import { RequestWorkshopDTO } from "./request-workshop.dto";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller('workshops')
export class WorkshopController {
  constructor(
    private workshopService: WorkshopService
  ) {}

  @ApiOperation({ summary: 'Finds all Workshops' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get()
  async findAll() {
    return await this.workshopService.findAll()
  }

  @ApiOperation({ summary: 'Finds a single Workshop by workshop_id'})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':workshop_id')
  async findById(
    @Param('workshop_id') id: string
  ): Promise<ResponseWorkshopDTO> {
    return await this.workshopService.findById(id);
  }

  @ApiOperation({ summary: 'Creates a new workshop for the event' })
  @ApiBody({
    description: 'Workshop object of an actual workshop',
    type: RequestWorkshopDTO
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Post()
  async create(
    @Body() createWorkshopDTO: RequestWorkshopDTO
  ) : Promise<ResponseWorkshopDTO> {
    return await this.workshopService.create(createWorkshopDTO);
  }

  @ApiOperation({ summary: 'Updates a new workshop for the event' })
  @ApiParam({
    description: 'ID of existing workshop',
    name: 'workshop_id'
  })
  @ApiBody({
    description: 'Workshop object of an actual workshop',
    type: RequestWorkshopDTO
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Put(":workshop_id")
  async update(
    @Param('workshop_id') id: string,
    @Body() createWorkshopDTO: RequestWorkshopDTO
  ) : Promise<ResponseWorkshopDTO> {
    return await this.workshopService.update(id, createWorkshopDTO);
  }

  @ApiOperation({ summary: 'Deletes a workshop' })
  @ApiParam({
    description: 'ID of existing workshop',
    name: 'workshop_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Delete(':workshop_id')
  async delete(
    @Param('workshop_id') id: string
  ) {
    return this.workshopService.delete(id);
  }
}