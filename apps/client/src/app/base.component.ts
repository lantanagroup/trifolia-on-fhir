import {AuthService} from './shared/auth.service';
import {DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {findPermission} from '../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from './shared/config.service';

export class BaseComponent {
  constructor(
    protected configService: ConfigService,
    protected authService: AuthService) {

  }

  private canReadOrWrite(resource: DomainResource, permission: 'read'|'write') {
    if (!resource || !this.configService.config || !this.authService.practitioner) {
      return false;
    }

    if (!this.configService.config.enableSecurity) {
      return true;
    }

    const foundEveryone = findPermission(resource.meta, 'everyone', permission);
    const foundUser = findPermission(resource.meta, 'user', permission, this.authService.practitioner.id);
    const foundGroups = this.authService.groups.filter((group) => {
      return findPermission(resource.meta, 'group', permission, group.id);
    }).length > 0;

    return foundEveryone || foundUser || foundGroups;
  }

  public canView(resource: DomainResource) {
    return this.canReadOrWrite(resource, 'read');
  }

  public canEdit(resource: DomainResource) {
    return this.canReadOrWrite(resource, 'write');
  }
}
