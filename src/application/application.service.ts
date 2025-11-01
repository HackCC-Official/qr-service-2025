import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { AxiosError } from "node_modules/axios/index.cjs";
import { Observable, catchError, firstValueFrom } from "rxjs";
import { ApplicationResponseDTO } from "./application.dto";

@Injectable()
export class ApplicationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(ApplicationService.name)
    private readonly logger: PinoLogger,
  ) {}

    async findHackationApplicationByUserId(user_id: string): Promise<ApplicationResponseDTO> {
    const accountServiceUrl = 
      this.configService.get<string>('APPLICATION_SERVICE_URL')

    const { data } = await firstValueFrom(
      this.httpService.get(
        accountServiceUrl + '/applications/hackathon/user/' + user_id,
        {
          headers: {
            Authorization: this.httpService.axiosRef.defaults.headers.common['Authorization'],
          }
        }
      )
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error)
          throw new Error("Application for UserId " + user_id + " doesn't exist.");
        })
      )
    )
    return data;
  }
}