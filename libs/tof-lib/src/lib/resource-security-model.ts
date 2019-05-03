export interface ResourceSecurityModel {
  type: 'everyone'|'group'|'user';
  id?: string;
  permission: 'read'|'write';
}
