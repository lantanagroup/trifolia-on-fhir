import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DomainResource} from '@trifolia-fhir/stu3';
import {getAuthIdIdentifier, getAuthIdSource, Globals, Paginated} from '@trifolia-fhir/tof-lib';
import {FhirService} from '../../shared/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirReferenceModalComponent} from '../../fhir-edit/reference-modal/reference-modal.component';
import {
  addPermission,
  getErrorString,
  getHumanNameDisplay,
  getHumanNamesDisplay,
  getUserEmail,
  groupBy,
  removePermission
} from '@trifolia-fhir/tof-lib';
import {firstValueFrom, mergeMap, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {GroupService} from '../../shared/group.service';
import {ConfigService} from '../../shared/config.service';
import {ImplementationGuideService} from '../../shared/implementation-guide.service';
import type {IPractitioner} from '@trifolia-fhir/tof-lib';
import type {IGroup, IPermission, IProject, IUser} from '@trifolia-fhir/models';
import { UserService } from '../../shared/user.service';

class ResourceSecurity {
  type: 'everyone'|'User'|'Group';
  id?: string;
  display?: string;
  canRead: boolean;
  canWrite: boolean;

  public get permission(): string {
    if (this.canRead && this.canWrite) {
      return 'Read/Write';
    } else if (this.canRead) {
      return 'Read';
    } else if (this.canWrite) {
      return 'Write';
    } else {
      return 'None';
    }
  }

  public getTypeDisplay() {
    return this.type.substring(0, 1).toUpperCase() + this.type.substring(1);
  }
}

@Component({
  selector: 'trifolia-fhir-resource-permissions',
  templateUrl: './resource-permissions.component.html',
  styleUrls: ['./resource-permissions.component.css']
})
export class ResourcePermissionsComponent implements OnInit {
  @Input() resource: IProject;

  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  public groupsArray: IGroup[];
  public usersArray: IUser[];
  public foundGroupsArray: IGroup[];
  public foundUsersArray: IUser[];
  public searchGroupsCriteria: string;
  public searchUsersCriteria: string;
  public message: string;
  public resourceTypes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
  public copyResourceType: string;
  public copyResource: DomainResource;
  public isSearchingGroups = false;

  private currentUser: IUser;

  public Globals = Globals;
  public getHumanNamesDisplay = getHumanNamesDisplay;

  public getAuthIdIdentifier  = getAuthIdIdentifier;
  public getAuthIdSource = getAuthIdSource;
  public getUserEmail = getUserEmail;

  constructor(
    public configService: ConfigService,
    private fhirService: FhirService,
    private groupService: GroupService,
    private userService: UserService,
    private implementationGuideService: ImplementationGuideService,
    private modal: NgbModal) {

  }

  // get meta(): Meta {
  //   if (this.resource) {
  //     return this.resource.meta;
  //   }
  // }

  copyTypeaheadSearch = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.fhirService
          .search(this.copyResourceType, term, true)
          .pipe(
            mergeMap((conf) => conf.results)
          )
      )
    );
  };

  getIdentifierDisplay(user: IPractitioner) {
    const tofIdentifier = (user.identifier || []).find(next => next.system === 'https://trifolia-fhir.lantanagroup.com');

    if (tofIdentifier && tofIdentifier.value) {
      const valueParts = tofIdentifier.value.split('|');

      if (valueParts && valueParts.length > 1) {
        return valueParts[1];
      } else {
        return tofIdentifier.value;
      }
    }
  }

  copyTypeaheadFormatter = (resource: any) => {
    let display = resource.title || resource.name;

    if (display instanceof Array) {
      display = getHumanNamesDisplay(display);
    } else if (typeof display === 'object') {
      display = getHumanNameDisplay(display);
    }

    if (display) {
      return `${display} (id: ${resource.id})`;
    } else {
      return 'id: ' + resource.id;
    }
  };

  public get security(): ResourceSecurity[] {
    if (!this.resource) {
      return [];
    }

    const perms = this.resource.permissions || [];
    const grouped = groupBy(perms, (next) => next.type + next.targetId);
    const groupedKeys = Object.keys(grouped);

    return groupedKeys.map((groupedKey) => {
      const group: IPermission[] = grouped[groupedKey];
      const next = new ResourceSecurity();
      next.type = group[0].type;
      next.id = group[0].targetId?.toString();

      if (next.type === 'Group' && this.groupsArray) {
        const found = (this.groupsArray || []).find((g: IGroup) => g.id === next.id);
        if (found) {
          next.display = found.name;
        }
      }

      if (next.type === 'User' && this.usersArray) {
        const found = (this.usersArray || []).find((u: IUser) => u.id === next.id);
        if (found) {
          next.display = found.name;
        }
      }

      next.canRead = !!group.find((nextSub) => nextSub.grant === 'read');
      next.canWrite = !!group.find((nextSub) => nextSub.grant === 'write');
      return next;
    });

  }

  public get foundGroups(): IGroup[] {
    if (this.foundGroupsArray && this.foundGroupsArray.length > 0) {
      return this.foundGroupsArray;
    }

    return [];
  }

  public get foundUsers(): IUser[] {
    if (this.foundUsersArray && this.foundUsersArray.length > 0) {
      return this.foundUsersArray;
    }

    return [];
  }

  public searchGroups() {
    this.isSearchingGroups = true;
    this.groupService.getMembership(this.searchGroupsCriteria).toPromise()
      .then((results: IGroup[]) => {
        this.foundGroupsArray = results;
        this.isSearchingGroups = false;
      })
      .catch((err) => {
        this.message = getErrorString(err);
        this.isSearchingGroups = false;
      });
  }

  public searchUsers() {
    firstValueFrom(this.userService.getUsers(this.searchUsersCriteria))
      .then((res: Paginated<IUser>) => this.foundUsersArray = res.results)
      .catch((err) => this.message = getErrorString(err));
  }

  public addPermission(type: 'User'|'Group'|'everyone', permission: 'read'|'write', id?: string) {
    if (addPermission(this.resource, type, permission, id)) {
      this.getPermittedResources();
    }
  }

  public removePermission(type: 'User'|'Group'|'everyone', permission: 'read'|'write', id?: string) {
    removePermission(this.resource, type, permission, id);
  }

  /**
   * Gets all users and groups that are assigned
   * permissions to this resource. There is a possibility that
   * the user is not a member of one of the groups that are
   * permitted to the resource. In that case, the group will not
   * be returned by the server call, and the UI will just show
   * the ID of the group.
   */
  private getPermittedResources() {
    const permissions: IPermission[] = this.resource?.permissions ?? [];
    const groupIds = [... new Set(permissions
      .filter((p) => p.type === 'Group')
      .map((p) => p.targetId?.toString()))];
    const userIds = [... new Set(permissions
      .filter((p) => p.type === 'User')
      .map((p) => p.targetId?.toString()))];

    if (groupIds.length > 0) {
      firstValueFrom(this.groupService.getGroupInfo(groupIds))
        .then((results: IGroup[]) => this.groupsArray = results)
        .catch((err) => this.message = getErrorString(err));
    }

    if (userIds.length > 0) {
      firstValueFrom(this.userService.getUsers(null, null, userIds.join(',')))
        .then((res: Paginated<IUser>) => this.usersArray = res.results)
        .catch((err) => this.message = getErrorString(err));
    }
  }

  private findCurrentUserPermission(permission: 'read'|'write') {

    if (!this.resource.permissions) {
      return false;
    }

    return this.resource.permissions.find((perm: IPermission) => {
      if (perm.grant !== permission) {
        return false;
      }

      if (perm.type === 'User' && perm.targetId === this.currentUser.id) {
        return true;
      } else if (perm.type === 'Group' && this.groupsArray) {
        return !!(this.groupsArray || []).find((group: IGroup) => {

          return !!(group.members || []).find((member: IUser|string) => {
            if (member['id']) {
              return member['id'] === this.currentUser.id;
            }
            return member === this.currentUser.id;
          });
        });
      } else if (perm.type === 'everyone') {
        return true;
      }

      return false;
    });
  }

  public selectCopyResource() {
    const modalRef = this.modal.open(FhirReferenceModalComponent, { size: 'lg', backdrop: 'static' });

    modalRef.result.then((results) => {
      this.copyResourceType = results.resourceType;
      this.copyResource = results.resource;
    });
  }

  public copyPermissions() {
    if (!this.copyResource) {
      return;
    }

    if (this.copyResource.meta && this.copyResource.meta.security && this.copyResource.meta.security.length > 0) {

      const meCanRead = this.findCurrentUserPermission('read');
      const meCanWrite = this.findCurrentUserPermission('write');

      if (!meCanRead) {
        this.addPermission('User', 'read', this.currentUser.id);
      }
      if (!meCanWrite) {
        this.addPermission('User', 'write', this.currentUser.id);
      }

      this.getPermittedResources();
    } else {
      alert('The selected resource does not have any permissions defined');
    }
  }

  public copyIgPermissions() {
    this.implementationGuideService.copyPermissions(this.resource.id).toPromise()
      .then((count: number) => {
        alert(`The implementation guide's permissions have been copied to ${count} child resources.`);
      })
      .catch((err) => {
        alert('An error occurred while copying permissions from the IG to child resources.');
      });
  }

  ngOnInit() {
    this.getPermittedResources();

    firstValueFrom(this.userService.getMe())
      .then((currentUser: IUser) => this.currentUser = currentUser)
      .catch((err) => this.message = getErrorString(err));
  }
}
