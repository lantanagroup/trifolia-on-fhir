export interface IFhirConfigServer {
  id: string;
  name: string;
  uri: string;
  version: 'stu3'|'r4'
  short?: string;
}

export interface IFhirConfig {
  nonEditableResources: { [resourceType: string]: string[] };
  publishedGuides: string;
  latestPublisher: string;
  publishedVersions?: [{
    version: string;
    url: string;
  }];
  servers: IFhirConfigServer[];
  terminologyServer?: string;
}
