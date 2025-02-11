import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { WorkshopService } from "./workshop.service";
import { ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { ResponseWorkshopDTO } from "./response-workshop.dto";
import { RequestWorkshopDTO } from "./request-workshop.dto";

@Controller('workshops')
export class WorkshopController {
  constructor(
    private workshopService: WorkshopService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Finds all Workshops' })
  async findAll() {
    return await this.workshopService.findAll()
  }

  @Get(':workshop_id')
  @ApiOperation({ summary: 'Finds a single Workshop by workshop_id'})
  async findById(
    @Param('workshop_id') id: string
  ): Promise<ResponseWorkshopDTO> {
    return await this.workshopService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new workshop for the event' })
  @ApiBody({
    description: 'Workshop object of an actual workshop',
    type: RequestWorkshopDTO
  })
  async create(
    @Body() createWorkshopDTO: RequestWorkshopDTO
  ) : Promise<ResponseWorkshopDTO> {
    return await this.workshopService.create(createWorkshopDTO);
  }

  @Delete(':workshop_id')
  @ApiOperation({ summary: 'Deletes a workshop' })
  @ApiParam({
    description: 'ID of existing workshop',
    name: 'workshop_id'
  })
  async delete(
    @Param('workshop_id') id: string
  ) {
    return this.workshopService.delete(id);
  }
}