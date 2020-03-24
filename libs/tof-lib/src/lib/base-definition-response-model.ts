import {StructureDefinition as STU3StructureDefinition} from './stu3/fhir';
import {StructureDefinition as R4StructureDefinition} from './r4/fhir';

export class BaseDefinitionResponseModel {
  success = true;
  message: string;
  base: STU3StructureDefinition | R4StructureDefinition;
}
