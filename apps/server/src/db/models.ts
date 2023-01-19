import { IDomainResource, IImplementationGuide } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';

export interface IProjectPermission {
  targetId: string;
  type: 'user'|'group';
  grant: 'read'|'write';
}

export interface IProjectContributor {
  userId?: string;
  name?: string;
}

export interface IProject {
  _id?: string;
  name: string;
  authorId: string;
  contributors?: IProjectContributor[];
  fhirVersion: 'stu3'|'r4';
  permissions?: IProjectPermission[];
  ig: IImplementationGuide;
}

export interface IUser {
  _id?: string;
  authId?: string[];
  email?: string;
  phone?: string;
}

export interface IGroup {
  _id?: string;
  name: string;
  description?: string;
  managingUserId: string;
  member: string[];
}

export interface IProjectResource {
  _id?: string;
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
  _id: string;
  action: 'read'|'update'|'delete'|'create',
  timestamp: Date,
  who: string;
  what: string;
  note?: string;
  networkAddr?: string;
}