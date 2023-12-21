import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { tap } from "rxjs";
import { AUDIT_ACTION, AUDIT_ENTITY_PARAM_ID, AUDIT_ENTITY_TYPE } from "./audit.decorator";
import { AuditService } from "./audit.service";
import { AuditAction, AuditEntityType, IBaseEntity } from "@trifolia-fhir/models";
import { IBaseDataService } from "../base/interfaces";
import { UsersService } from "../users/users.service";
import { GroupsService } from "../groups/groups.service";
import { ProjectsService } from "../projects/projects.service";
import { FhirResourcesService } from "../fhir-resources/fhir-resources.service";
import { NonFhirResourcesService } from "../non-fhir-resources/non-fhir-resources.service";

@Injectable()
export class AuditInterceptor implements NestInterceptor {

  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,

    private readonly fhirResourcesService: FhirResourcesService,
    private readonly groupsService: GroupsService,
    private readonly nonFhirResourcesService: NonFhirResourcesService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
    ) {
  }

  private getEntityServiceFromType(enityType: AuditEntityType): IBaseDataService<IBaseEntity> {
    switch (enityType) {
      case 'User':
        return this.usersService;
      case 'Group':
        return this.groupsService;
      case 'Project':
        return this.projectsService;
      case 'FhirResource':
        return this.fhirResourcesService;
      case 'NonFhirResource':
        return this.nonFhirResourcesService;
    }
  }


  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {

    // require an audit action and entity type to be set to trigger this interceptor
    if (!(
      this.reflector.get(AUDIT_ACTION, context.getHandler()) &&
      this.reflector.get(AUDIT_ENTITY_TYPE, context.getHandler())
    )) {
      return next.handle();
    }

    let audit = this.auditService.getAuditFromContext(context);
    let auditEntityParamId = this.reflector.get(AUDIT_ENTITY_PARAM_ID, context.getHandler());
    let service = this.getEntityServiceFromType(audit.entityType);
    let req = context.switchToHttp().getRequest();

    // if the audit action is an update, get the original entity to later compare with the updated entity
    let original: IBaseEntity;
    if (audit.action === AuditAction.Update || audit.action === AuditAction.Delete) {
      original = await service.findById(req.params[auditEntityParamId]);
    }

    return next.handle().pipe(
      tap((res: IBaseEntity) => {
        if (!res) {
          audit.entityValue = original;
          this.auditService.create(audit);
          return;
        }

        // result and any original entity is most likely actually mongoose document,
        // so convert to a plain object to avoid doing diffs on all the mongoose document properties
        res = service.getModel().hydrate(res).toObject();

        if (original) {
          original = service.getModel().hydrate(original).toObject();
          audit.propertyDiffs = this.auditService.getAuditPropertyDiffs(original, res);
        }


        audit.entityValue = res;
        this.auditService.create(audit);

      }));

  }

}
