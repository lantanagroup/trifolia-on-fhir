import {IHumanName} from './fhirInterfaces';

export class UserModel {
  id: string;
  identifier: any;
  name: IHumanName[];
}
