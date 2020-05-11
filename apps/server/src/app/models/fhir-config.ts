export interface IFhirConfigServer {
  id: string;
  name: string;
  uri: string;
  version: 'stu3'|'r4'
  short?: string;
  supportsSnapshot?: boolean;   // TODO: Should be replaced with logic to check the capability statement of the FHIR server
}

export interface IFhirConfig {
  nonEditableResources: { [resourceType: string]: string[] };
  publishedGuides: string;
  servers: IFhirConfigServer[];
  terminologyServer?: string;
}
