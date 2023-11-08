import type { IDomainResource } from '../fhirInterfaces';
import { NonFhirResourceType } from './non-fhir-resource-type';

export * from './non-fhir-resource-type';

export interface IPermission {
  target?: string|IUser|IGroup;
  type: 'User'|'Group'|'everyone';
  grant: 'read'|'write';
}

export interface IProjectContributor {
  user?: string;
  name?: string;
}

export interface IBaseEntity {
  id?: string;
}

export interface IBaseEntityReferences extends IBaseEntity {
  referencedBy?: IProjectResourceReference[];
  references?: IProjectResourceReference[];
}

export interface IProject extends IBaseEntityReferences {
  migratedFrom?: string;
  name: string;
  author: string;
  contributors?: IProjectContributor[];
  fhirVersion: 'stu3'|'r4'|'r5';
  permissions?: IPermission[];
  isDeleted: boolean;
}

export interface IUser extends IBaseEntity {
  authId?: string[];
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  readonly name: string;
}

export interface IGroup extends IBaseEntity {
  migratedFrom?: string;
  name?: string;
  description?: string;
  managingUser?: IUser;
  members?: IUser[];
}

export interface IProjectResource extends IBaseEntityReferences {
  name?: string;
  description?: string;
  projects?: IProject[];
  migratedFrom?: string;

  versionId: number;
  lastUpdated: Date;
  isDeleted?: boolean;
}

export interface IProjectResourceReference {
  value: IFhirResource|INonFhirResource|string|IProject;
  valueType: 'FhirResource'|'NonFhirResource'|'Project';
}

export interface IProjectResourceReferenceMap {
  [key: string]: IProjectResourceReference;
}

export interface IFhirResource  extends IProjectResource {
  fhirVersion: 'stu3'|'r4'|'r5';
  resource: IDomainResource;
}

export interface INonFhirResource extends IProjectResource {
  type: NonFhirResourceType;
  content?: any;
}


export interface IHistory extends IProjectResource {
  content?: IDomainResource|any;
  current:  IProjectResourceReference;
}

export interface IAuditPropertyDiff {
  path: string;
  oldValue: any;
  newValue: any;
}

export enum AuditAction {
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Create = 'create',
  Login = 'login'
}
export enum AuditEntityType {
  User = 'User',
  Group = 'Group',
  Project = 'Project',
  FhirResource = 'FhirResource',
  NonFhirResource = 'NonFhirResource'
}
export type AuditEntityValue = IUser|IGroup|IProject|IFhirResource|INonFhirResource|string;

export interface IAudit extends IBaseEntity {
  action: AuditAction,
  timestamp: Date,
  user?: IUser;
  entityType?: AuditEntityType;
  entityValue?: AuditEntityValue;
  propertyDiffs?: IAuditPropertyDiff[];
  note?: string;
  networkAddr?: string;
}
