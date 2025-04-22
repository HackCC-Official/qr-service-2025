import { Inject, Injectable } from "@nestjs/common";
import { and, eq, inArray } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { RequestWorkshopDTO } from "./request-workshop.dto";
import { ResponseWorkshopDTO } from "./response-workshop.dto";
import { AccountService } from "src/account/account.service";


@Injectable()
export class WorkshopService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(WorkshopService.name)
    private readonly logger: PinoLogger,
    private accountService: AccountService
  ) {}

  async findAll(): Promise<ResponseWorkshopDTO[]> {
    const workshop = await this.db
      .query
      .workshops
      .findMany({ with: { workshop_organizers: true }});
    
    return Promise.all( 
        workshop.map(async ({ workshop_organizers, ...workshop}) => {
        const organizerIds = workshop_organizers.map(o => o.account_id);
        const accounts = await this.accountService.batchFindById(organizerIds);
        return {
          ...workshop,
          organizers: accounts
        }
      })
    )
  }

  async findById(id: string): Promise<ResponseWorkshopDTO> {
    const { workshop_organizers, ...workshop} = await this.db.query.workshops.findFirst({
      where: eq(schema.workshops.id, id),
      with: {
        workshop_organizers: true  // This will automatically include all organizers
      }
    });
    
    const organizerIds = workshop_organizers.map(o => o.account_id);
    const accounts = await this.accountService.batchFindById(organizerIds);
    return {
      ...workshop,
      organizers: accounts
    }
  }

  async create(createWorkshopDTO: RequestWorkshopDTO): Promise<ResponseWorkshopDTO> {
    const workshopId = await this.db.transaction(async tx => {
      const { organizers, ...workshop } = createWorkshopDTO
      const [workshopResult] = await tx
        .insert(schema.workshops)
        .values(workshop)
        .returning({ workshopId: schema.workshops.id})
      
      organizers.forEach(async o => {
        await tx
        .insert(schema.workshop_organizers)
        .values({
          workshop_id: workshopResult.workshopId,
          organizer_id: o
        })
      })

      return workshopResult.workshopId
    })

    const workshop = this.findById(workshopId)

    this.logger.info({ msg: 'Creating workshop', workshop })

    return workshop;
  }

  async update(workshopId: string, updateWorkshopDTO: RequestWorkshopDTO): Promise<ResponseWorkshopDTO> {
    await this.db.transaction(async tx => {
      const [workshop] = await tx
        .update(schema.workshops)
        .set(updateWorkshopDTO)
        .where(eq(schema.workshops.id, workshopId))
        .returning()

      // 2. Get current organizers
      const currentOrganizers = await tx
        .select()
        .from(schema.workshop_organizers)
        .where(eq(schema.workshop_organizers.workshop_id, workshopId));

      // 3. Calculate organizers to add/remove
      const currentOrganizerIds = currentOrganizers.map(o => o.account_id);
      const organizerIdsToAdd = updateWorkshopDTO.organizers.filter(
        id => !currentOrganizerIds.includes(id)
      );
      const organizerIdsToRemove = currentOrganizerIds.filter(
        id => !updateWorkshopDTO.organizers.includes(id)
      );

      // 4. Execute updates
      if (organizerIdsToRemove.length > 0) {
        await tx
          .delete(schema.workshop_organizers)
          .where(
            and(
              eq(schema.workshop_organizers.workshop_id, workshopId),
              inArray(schema.workshop_organizers.account_id, organizerIdsToRemove)
            )
          );
      }

      if (organizerIdsToAdd.length > 0) {
        await tx.insert(schema.workshop_organizers).values(
          organizerIdsToAdd.map(account_id => ({
            workshop_id: workshopId,
            account_id
          }))
        );
      }
    })

    const workshop = this.findById(workshopId)

    this.logger.info({ msg: 'Updating workshop', workshop })

    return workshop
  }

  async delete(workshopId: string) {
    const [workshop] = await this
      .db
      .delete(schema.workshops)
      .where(eq(schema.workshops.id, workshopId))
      .returning()

    this.logger.info({ msg: 'Updating workshop', workshop })

    return workshop;
  }
}