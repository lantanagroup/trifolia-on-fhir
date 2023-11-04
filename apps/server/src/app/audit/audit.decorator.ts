import { SetMetadata, applyDecorators } from "@nestjs/common";
import { AuditAction, AuditEntityType } from "@trifolia-fhir/models";

export const AUDIT_ACTION = 'AUDIT_ACTION';
export const AUDIT_ENTITY_TYPE = 'AUDIT_ENTITY_TYPE';
export const AUDIT_ENTITY_PARAM_ID = 'AUDIT_ENTITY_PARAM_ID';

export function AuditEntity<IBaseEntity>(action: AuditAction, entityType: AuditEntityType, entityIdParamName: string = 'id') { 
  return applyDecorators(
    SetMetadata(AUDIT_ACTION, action),
    SetMetadata(AUDIT_ENTITY_TYPE, entityType),
    SetMetadata(AUDIT_ENTITY_PARAM_ID, entityIdParamName)
    );
}
