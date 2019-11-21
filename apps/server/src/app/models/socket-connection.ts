import {Practitioner} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

export interface ISocketConnection {
  id: string;
  practitioner?: Practitioner;
  userProfile?: {
    sub: string;
    email: string;
    // Add more properties as needed
  }
}
