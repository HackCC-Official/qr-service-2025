import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError, AxiosResponse } from "axios";
import { Observable, catchError, firstValueFrom } from "rxjs";
import { AccountDTO } from "./account.dto";
import { ConfigService } from "@nestjs/config";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Injectable()
export class AccountService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(AccountService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findById(id: string): Promise<AccountDTO> {
    const accountServiceUrl = 
      this.configService.get<string>('ACCOUNT_SERVICE_URL')

    const { data } = await firstValueFrom(
      this.httpService.get(accountServiceUrl + '/' + id)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error)
          throw new Error("Account ID " + id + " doesn't exist.");
        })
      )
    )
    return data;
  }
}