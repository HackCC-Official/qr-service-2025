import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkshopOrganizerService } from "./workshop-organizer.service";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { RequestWorkshopOrganizerDTO } from "./request-workshop-organizer.dto";
import { ResponseWorkshopOrganizerDTO } from "./response-workshop-organizer.dto";
import { AccountService } from "src/account/account.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@ApiTags('Workshop Organizers')
@Controller('workshop-organizers')
export class WorkshopOrganizerController {
  constructor(
    private workshopOrganizerService: WorkshopOrganizerService,
  ) {}

  @ApiOperation({ summary: 'Finds all Workshop Organizers' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get()
  async findAll() {
    return await this.workshopOrganizerService.findAll()
  }

  @ApiOperation({ summary: 'Finds all workshop organizers belonging to a workshop' })
  @ApiParam({
    description: 'ID of existing workshop',
    name: 'workshop_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':workshop_id/organizers')
  async findByWorkshopId(
    @Param('workshop_id') workshop_id: string, 
  ) {
    return await this.workshopOrganizerService.findByWorkshopId(workshop_id);
  }

  @ApiOperation({ summary: 'Finds a workshop organizer detail using workshop_id and organizer_id' })
  @ApiParam({
    description: 'ID of existing workshop',
    name: 'workshop_id'
  })
  @ApiParam({
    description: 'ID of existing organizer',
    name: 'organizer_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':workshop_id/organizers/:organizer_id')
  async findByWorkshopIdAndOrganizerId(
    @Param('workshop_id') workshop_id: string, 
    @Param('organizer_id') organizer_id: string
  ) {
    return await this.workshopOrganizerService.findByWorkshopIdAndOrganizerId(workshop_id, organizer_id);
  }

  @ApiOperation({ summary: 'Creates a new workshop organizer for a workshop' })
  @ApiBody({
    description: 'Workshop Organizer object',
    type: RequestWorkshopOrganizerDTO,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Post()
  async create(
    @Body() createWorkshopOrganizerDTO: RequestWorkshopOrganizerDTO,
  ): Promise<ResponseWorkshopOrganizerDTO> {
    return await this.workshopOrganizerService.create(createWorkshopOrganizerDTO);
  }
  
  @ApiOperation({ summary: 'Deletes a workshop organizer from a workshop' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Delete(':workshop_organizer_id')
  async delete(
    @Param('workshop_organizer_id') id: string
  ): Promise<ResponseWorkshopOrganizerDTO> {
    return await this.workshopOrganizerService.delete(id);
  }
}