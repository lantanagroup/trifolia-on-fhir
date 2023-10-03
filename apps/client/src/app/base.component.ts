import {AuthService} from './shared/auth.service';
import {findPermission} from '@trifolia-fhir/tof-lib';
import {ConfigService} from './shared/config.service';
import {IPermission, IProjectResource} from '@trifolia-fhir/models';
import { ProjectService } from './shared/projects.service';
import { firstValueFrom } from 'rxjs';

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

  protected canReadOrWrite(permissions: IPermission[], permission: 'read'|'write'): boolean {
    const foundEveryone = findPermission(permissions, 'everyone', permission);
    const foundUser = findPermission(permissions, 'User', permission, this.authService.user.id);
    const foundGroups = this.authService.groups.filter((group) => {
      return findPermission(permissions, 'Group', permission, group.id);
    }).length > 0;

    return foundEveryone || foundUser || foundGroups;
  }

  protected canReadOrWriteResource(resource: IProjectResource, permission: 'read'|'write'): boolean {
    // Security is not enabled
    if (!this.configService.config.enableSecurity) {
      return true;
    }

    // User is an admin, should have access to everything
    if (this.authService.userProfile.isAdmin) {
      return true;
    }

    // Basic error checking to make sure we have the info we need to proceed
    if (!this.authService.user) {
      return false;
    }

    // Get permissions for the project that contains this resource
    let permissions: Array<IPermission> = [];
    if (this.configService.currentProject && this.configService.currentProject.permissions) {
      permissions = this.configService.currentProject.permissions;
    }

    return this.canReadOrWrite(permissions, permission);
  }

  public canView(resource: IProjectResource) {
    return this.canReadOrWriteResource(<IProjectResource>resource, 'read');
  }

  public canEdit(resource: IProjectResource) {
    return this.canReadOrWriteResource(<IProjectResource>resource, 'write');
  }
}
