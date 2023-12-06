export interface ResourceSecurityModel {
  type: 'everyone'|'Group'|'User';
  id?: string;
  permission: 'read'|'write';
  inactive: boolean;
}
