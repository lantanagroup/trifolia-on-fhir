import {IStructureDefinition} from './fhirInterfaces';

export class BaseDefinitionResponseModel {
  success = true;
  message: string;
  base: IStructureDefinition;
}
