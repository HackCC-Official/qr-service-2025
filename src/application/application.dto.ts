import { AccountDTO } from "src/account/account.dto";

export class ApplicationResponseDTO {
  id: string;
  
  user: AccountDTO;

  status: Status;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  school: string;

  reviewerId?: string;

  transcriptUrl: string;

  resumeUrl: string;

  type: ApplicationType;
}

export enum Status {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
  NOT_AVAILABLE = 'NOT_AVAILABLE'
}

export enum ApplicationType {
  HACKATHON = 'HACKATHON',
  ORGANIZER = 'ORGANIZER',
  VOLUNTEER = 'VOLUNTEER',
  JUDGE = 'JUDGE'
}