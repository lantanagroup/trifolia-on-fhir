import {ResourceReference as R4ResourceReference} from './r4/fhir';
import {ResourceReference as STU3ResourceReference} from './stu3/fhir';

export class ActiveUserModel {
  socketId: string;
  userId: string;
  email: string;
  practitionerReference: R4ResourceReference | STU3ResourceReference;
  name: string;
}
