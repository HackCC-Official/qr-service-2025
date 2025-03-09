import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly httpService: HttpService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']; // Extract the token

    if (token) {
      // Set the token in the Axios default headers
      this.httpService.axiosRef.defaults.headers.common['Authorization'] = token;
    }

    return next.handle().pipe(
      tap(() => {
        // Clean up or perform actions after the request is handled
      }),
    );
  }
}