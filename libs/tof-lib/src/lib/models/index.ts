import type { IDomainResource } from '../fhirInterfaces';

export interface IPermission {
  targetId?: string;    // no targetId means "everyone"
  type: 'user'|'group'|'everyone';
  grant: 'read'|'write';
}

export interface IProjectContributor {
  user?: string;
  name?: string;
}

export interface IProject {
  id?: string;
  migratedFrom?: string;
  name: string;
  author: string;
  contributors?: IProjectContributor[];
  fhirVersion: 'stu3'|'r4'|'r5';
  permissions?: IPermission[];
  referencedBy?: IProjectResourceReference[];
  references: IProjectResourceReference[];
  isDeleted: boolean;
}

export interface IUser {
  id?: string;
  authId?: string[];
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  readonly name: string;
}

export interface IGroup {
  id?: string;
  migratedFrom?: string;
  name?: string;
  description?: string;
  managingUser?: IUser;
  members?: IUser[];
}

export interface IProjectResource {
  id?: string;
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
}

export interface IProjectResourceReference {
  value: IFhirResource|IExample|string|IProject;
  valueType: 'FhirResource'|'Example'|'Project';
}

export interface IProjectResourceReferenceMap {
  [key: string]: IProjectResourceReference;
}

export interface IFhirResource  extends IProjectResource {
  fhirVersion: 'stu3'|'r4'|'r5';
  resource: IDomainResource;
}

export interface IExample extends IProjectResource {
  fhirVersion?: 'stu3'|'r4'|'r5';
  content?: IDomainResource|any;  // Ideally this would be a resource OR a string, but not sure how we would populate IG.definition.resource.reference
  exampleFor?: string;    // StructureDefinition in which this is a profile for
  igIds?: string[];
}

export interface INonFhirResource extends IProjectResource {
  type: 'page'|'media'|'binary'|'other';
  content?: any;
}


export interface IHistory extends IProjectResource {
  fhirVersion?: 'stu3'|'r4'|'r5';
  content?: IDomainResource|any;
  targetId: string;
  type: 'fhirResource'|'example';
}

export interface IAudit {
  _id?: string;
  action: 'read'|'update'|'delete'|'create',
  timestamp: Date,
  who: string;
  what: string;
  note?: string;
  networkAddr?: string;
}
