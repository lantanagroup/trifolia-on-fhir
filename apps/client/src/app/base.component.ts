import {AuthService} from './shared/auth.service';
import {DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {findPermission} from '../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from './shared/config.service';
import {IPermission, IProject, IProjectResource} from '@trifolia-fhir/models';

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
    this.configService.updateIsChanged(this.isDirty);
  }

  private canReadOrWrite(resource: IProjectResource, permission: 'read'|'write') {
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

    // Get permissions for the project that contains this resource
    const permissions: Array<IPermission> = resource.permissions;//[];

    const foundEveryone = findPermission(permissions, 'everyone', permission);
    const foundUser = findPermission(permissions, 'user', permission, this.authService.user.id);
    const foundGroups = this.authService.groups.filter((group) => {
      return findPermission(permissions, 'group', permission, group.id);
    }).length > 0;

    return foundEveryone || foundUser || foundGroups;
  }

  public canView(resource: IProjectResource) {
    return this.canReadOrWrite(<IProjectResource>resource, 'read');
  }

  public canEdit(resource: IProjectResource) {
    return this.canReadOrWrite(<IProjectResource>resource, 'write');
  }
}
