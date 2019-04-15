import {Practitioner} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

export interface ISocketConnection {
  id: string;
  practitioner?: Practitioner;
  userProfile?: {
    'user_id': string;
    email: string;
  }
  // TODO: Add more
}
