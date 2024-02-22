//export type NonFhirResourceType = 'page'|'media'|'binary'|'other';

import { INonFhirResource, IPermission, IProject, IProjectResourceReference } from ".";

export enum NonFhirResourceType {
  OtherNonFhirResource = "OtherNonFhirResource",

  Page = "Page",
  Media = "Media",
  Binary = "Binary",

  CdaExample = "CdaExample",
  StructureDefinitionIntro = "StructureDefinitionIntro",
  StructureDefinitionNotes = "StructureDefinitionNotes",

  IgnoreWarnings = "IgnoreWarnings",
  CustomMenu = "CustomMenu",
  PublicationRequest = "PublicationRequest",
  Template = "Template"
}

export const ImplementationGuideExampleTypes: NonFhirResourceType[] = [
  NonFhirResourceType.CdaExample
];


export abstract class NonFhirResource implements INonFhirResource {


  constructor(initialValues?: object) {
    for (const key in initialValues) {
      this[key] = initialValues[key];
    }
  }

  id?: string;
  content?: any;
  name?: string;
  description?: string;
  projects?: IProject[];
  migratedFrom?: string;
  versionId: number;
  lastUpdated: Date;
  permissions?: IPermission[];
  referencedBy?: IProjectResourceReference[];
  references?: IProjectResourceReference[];
  isDeleted?: boolean;
  type: NonFhirResourceType = NonFhirResourceType.OtherNonFhirResource;

}


export class CdaExample extends NonFhirResource {
  readonly type: NonFhirResourceType = NonFhirResourceType.CdaExample;
}

export class StructureDefinitionIntro extends NonFhirResource {
  readonly type: NonFhirResourceType = NonFhirResourceType.StructureDefinitionIntro;
}

export class StructureDefinitionNotes extends NonFhirResource {
  readonly type: NonFhirResourceType = NonFhirResourceType.StructureDefinitionNotes;
}

export class CustomMenu extends NonFhirResource {
  readonly type: NonFhirResourceType = NonFhirResourceType.CustomMenu;
}

export class IgnoreWarnings extends NonFhirResource {
  readonly type: NonFhirResourceType = NonFhirResourceType.IgnoreWarnings;
}

export class PublicationRequest extends NonFhirResource {
  readonly type: NonFhirResourceType = NonFhirResourceType.PublicationRequest;
}


export class OtherNonFhirResource extends NonFhirResource {
  readonly type: NonFhirResourceType = NonFhirResourceType.OtherNonFhirResource;
}

export class Page extends NonFhirResource  {
  readonly type: NonFhirResourceType = NonFhirResourceType.Page;

  navMenu? : string;
  reuseDescription? : boolean;

}

export class Template extends NonFhirResource  {
  readonly type: NonFhirResourceType = NonFhirResourceType.Template;

  templateType? : string;

}
