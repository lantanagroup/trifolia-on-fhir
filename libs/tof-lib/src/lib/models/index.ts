import type { IDomainResource, IImplementationGuide } from '../fhirInterfaces';

export interface IPermission {
  targetId?: string;    // no targetId means "everyone"
  type: 'user'|'group'|'everyone';
  grant: 'read'|'write';
}

export interface IProjectContributor {
  userId?: string;
  name?: string;
}

export interface IProject {
  _id?: string;
  migratedFrom?: string;
  name: string;
  authorId: string;
  contributors?: IProjectContributor[];
  fhirVersion: 'stu3'|'r4'|'r5';
  permissions?: IPermission[];
  ig: IImplementationGuide;
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
  _id?: string;
  migratedFrom?: string;
  fhirVersion: 'stu3'|'r4'|'r5';
  projectId?: string[];
  name?: string;
  groupingId?: string;    // from ImplementationGuide.definition.grouping. Not used in STU3
  description?: string;
}

export interface IConformance extends IProjectResource {
  resource: IDomainResource;
}

export interface IExample extends IProjectResource {
  content: IDomainResource;     // Ideally this would be a resource OR a string, but not sure how we would populate IG.definition.resource.reference
  exampleFor?: string;    // StructureDefinition in which this is a profile for
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

export class IHistory {
  _id?: string;
  migratedFrom?: string;
  content: IDomainResource;
  targetId: string;
  timestamp: Date;
  type: 'conformance'|'example';
  versionId: number;
}
