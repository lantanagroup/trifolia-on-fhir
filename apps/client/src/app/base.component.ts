import {AuthService} from './shared/auth.service';
import {DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {findPermission} from '../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from './shared/config.service';

export class BaseComponent {
  protected _isDirty = false;

  constructor(
    protected configService: ConfigService,
    protected authService: AuthService) {

  }

  protected get isDirty() {
    return this._isDirty;
  }

  protected set isDirty(value: boolean) {
    this._isDirty = value;
  }

  private canReadOrWrite(resource: DomainResource, permission: 'read'|'write') {
    // Security is not enabled
    if (!this.configService.config.enableSecurity) {
      return true;
    }

    // User is an admin, should have access to everything
    if (this.authService.userProfile.isAdmin) {
      return true;
    }

    // Basic error checking to make sure we have the info we need to proceed
    if (!resource || !this.configService.config || !this.authService.user) {
      return false;
    }

    const foundEveryone = findPermission(resource.meta, 'everyone', permission);
    const foundUser = findPermission(resource.meta, 'user', permission, this.authService.user.id);
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
