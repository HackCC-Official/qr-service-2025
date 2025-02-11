import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { WorkshopOrganizerService } from "./workshop-organizer.service";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RequestWorkshopOrganizerDTO } from "./request-workshop-organizer.dto";
import { ResponseWorkshopOrganizerDTO } from "./response-workshop-organizer.dto";
import { AccountService } from "src/account/account.service";

@ApiTags('Workshop Organizers')
@Controller('workshop-organizers')
export class WorkshopOrganizerController {
  constructor(
    private workshopOrganizerService: WorkshopOrganizerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Finds all Workshop Organizers' })
  async findAll() {
    return await this.workshopOrganizerService.findAll()
  }

  @Get(':workshop_id/organizer/:organizer_id')
  @ApiOperation({ summary: 'Finds a workshop organizer detail using workshop_id and organizer_id' })
  async findByWorkshopIdAndOrganizerId(
    @Param('workshop_id') workshop_id: string, 
    @Param('organizer_id') organizer_id: string
  ) {
    return await this.workshopOrganizerService.findByWorkshopIdAndOrganizerId(workshop_id, organizer_id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new workshop organizer for a workshop' })
  @ApiBody({
    description: 'Workshop Organizer object',
    type: RequestWorkshopOrganizerDTO,
  })
  async create(
    @Body() createWorkshopOrganizerDTO: RequestWorkshopOrganizerDTO
  ): Promise<ResponseWorkshopOrganizerDTO> {
    return await this.workshopOrganizerService.create(createWorkshopOrganizerDTO);
  }
  
  @Delete(':workshop_organizer_id')
  @ApiOperation({ summary: 'Deletes a workshop organizer from a workshop' })
  async delete(
    @Param('workshop_organizer_id') id: string
  ): Promise<ResponseWorkshopOrganizerDTO> {
    return await this.workshopOrganizerService.delete(id);
  }
}