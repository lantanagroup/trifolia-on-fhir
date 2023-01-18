import { IImplementationGuide } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';

export interface IProjectPermission {
  targetId: string;
  type: 'user'|'group';
  grant: 'read'|'write';
}

export interface IProject {
  _id?: string;
  name: string;
  authorId: string;
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
  managingUserId: string;
  member: string[];
}
