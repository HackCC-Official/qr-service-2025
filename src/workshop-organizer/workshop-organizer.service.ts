import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { ResponseWorkshopOrganizerDTO } from "./response-workshop-organizer.dto";
import { and, eq } from "drizzle-orm";
import { RequestWorkshopOrganizerDTO } from "./request-workshop-organizer.dto";
import { AccountService } from "src/account/account.service";
import { WorkshopService } from "src/workshop/workshop.service";

@Injectable()
export class WorkshopOrganizerService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(WorkshopOrganizerService.name)
    private readonly logger: PinoLogger,
    private workshopService: WorkshopService,
    private accountService: AccountService
  ) {}

  async findAll() {
    return await this.db
      .query
      .workshop_organizers
      .findMany();
  }

  async findByWorkshopId(workshop_id: string): Promise<ResponseWorkshopOrganizerDTO> {
    return await this.db
      .query
      .workshop_organizers
      .findFirst({ where: 
        and(
          eq(schema.workshop_organizers.workshop_id, workshop_id)
        ) 
      })
  }

  async findByWorkshopIdAndOrganizerId(workshop_id: string, organizer_id: string): Promise<ResponseWorkshopOrganizerDTO> {
    return await this.db
      .query
      .workshop_organizers
      .findFirst({ where: 
        and(
          eq(schema.workshop_organizers.account_id, organizer_id),
          eq(schema.workshop_organizers.workshop_id, workshop_id)
        ) 
      })
  }

  async create(createWorkshopOrganizerDTO: RequestWorkshopOrganizerDTO): Promise<ResponseWorkshopOrganizerDTO> {
    const account = await this.accountService.findById(createWorkshopOrganizerDTO.account_id);
    const workshop = await this.workshopService.findById(createWorkshopOrganizerDTO.workshop_id);

    if (!account) {
      throw new Error('account not found with account_id:' + createWorkshopOrganizerDTO.account_id);
    }

    if (!workshop) {
      throw new Error('workshop not found with workshop_id:' + createWorkshopOrganizerDTO.workshop_id)
    }

    const [workshop_organizer] = await this
      .db
      .insert(schema.workshop_organizers)
      .values(createWorkshopOrganizerDTO)
      .returning();

    this.logger.info({ msg: 'Creating Workshop Organizer', workshop_organizer })

    return workshop_organizer;
  }

  async delete(workshop_organizer_id: string): Promise<ResponseWorkshopOrganizerDTO> {
    const [workshop_organizer] = await this
      .db
      .delete(schema.workshop_organizers)
      .where(eq(schema.workshop_organizers.id, workshop_organizer_id))
      .returning()
    
    this.logger.info({ msg: 'Deleting Workshop Organizer', workshop_organizer })

    return workshop_organizer;
  }
}