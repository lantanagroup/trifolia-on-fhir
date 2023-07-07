export interface IFhirConfig {
  nonEditableResources: { [resourceType: string]: string[] };
  publishedGuides: string;
  terminologyServer?: string;
}
