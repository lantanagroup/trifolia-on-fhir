import type { IDomainResource, IImplementationGuide } from '../fhirInterfaces';

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
  igs: IConformance[];
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
}

export interface IConformance extends IProjectResource {
  //groupingId?: string;    // from ImplementationGuide.definition.grouping. Not used in STU3
  fhirVersion: 'stu3'|'r4'|'r5';
  igIds?: string[];
  references?: string[];
  resource: IDomainResource;
}

export interface IExample extends IProjectResource {
  fhirVersion?: 'stu3'|'r4'|'r5';
  content?: IDomainResource|any;  // Ideally this would be a resource OR a string, but not sure how we would populate IG.definition.resource.reference
  exampleFor?: string;    // StructureDefinition in which this is a profile for
}

export interface IHistory extends IProjectResource {
  fhirVersion?: 'stu3'|'r4'|'r5';
  content?: IDomainResource|any;
  targetId: string;
  type: 'conformance'|'example';
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
