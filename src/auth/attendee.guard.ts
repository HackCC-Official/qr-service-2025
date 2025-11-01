import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AccountRoles } from './role.enum';
import { ApplicationService } from 'src/application/application.service';
import { Status } from 'src/application/application.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AttendeeGuard implements CanActivate {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const accountId = request.params.account_id;

    if (!user || !user.user_roles) {
      throw new ForbiddenException('User not authenticated');
    }

    // If user has any role other than ATTENDEE, allow access
    const hasNonAttendeeRole = user.user_roles.some(
      (role: AccountRoles) => role !== AccountRoles.USER
    );

    if (hasNonAttendeeRole) {
      return true;
    }

    // Set the authorization header for the ApplicationService
    const token = request.headers['authorization']; // Extract the token
    if (token) {
      this.httpService.axiosRef.defaults.headers.common['Authorization'] = token;
    }

    // If user only has ATTENDEE role, check if they're accessing their own data
    if (user.user_metadata.sub !== accountId) {
      throw new ForbiddenException('Attendees can only access their own data');
    }

    // Check if the attendee has an accepted application
    try {
      const application = await this.applicationService
        .findHackationApplicationByUserId(user.user_metadata.sub);
      
      if (application.status !== Status.ACCEPTED) {
        throw new ForbiddenException('Application must be accepted to access this resource');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException('Unable to verify application status');
    }
  }
}