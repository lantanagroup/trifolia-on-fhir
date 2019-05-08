import {Component, Input, OnInit} from '@angular/core';
import {Bundle, DomainResource, Group, Meta, Practitioner} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {FhirService} from '../../shared/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirReferenceModalComponent} from '../../fhir-edit/reference-modal/reference-modal.component';
import {PractitionerService} from '../../shared/practitioner.service';
import {
  addPermission,
  ensureSecurity,
  getHumanNameDisplay,
  getHumanNamesDisplay,
  getMetaSecurity,
  getPractitionerEmail,
  groupBy,
  removePermission
} from '../../../../../../libs/tof-lib/src/lib/helper';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';

class ResourceSecurity {
  type: 'everyone'|'user'|'group';
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
  selector: 'app-resource-permissions',
  templateUrl: './resource-permissions.component.html',
  styleUrls: ['./resource-permissions.component.css']
})
export class ResourcePermissionsComponent implements OnInit {
  @Input() meta: Meta;

  public groupsBundle: Bundle;
  public usersBundle: Bundle;
  public foundGroupsBundle: Bundle;
  public foundUsersBundle: Bundle;
  public searchGroupsCriteria: string;
  public searchUsersCriteria: string;
  public message: string;
  public Globals = Globals;
  public getHumanNamesDisplay = getHumanNamesDisplay;
  public getPractitionerEmail = getPractitionerEmail;
  public resourceTypes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
  public copyResourceType: string;
  public copyResource: DomainResource;

  private currentUser: Practitioner;

  constructor(
    private practitionerService: PractitionerService,
    private fhirService: FhirService,
    private modal: NgbModal) {

  }

  copyTypeaheadSearch = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        this.fhirService
          .search(this.copyResourceType, term, true)
          .pipe(
            map((bundle: Bundle) =>
              (bundle.entry || []).map((entry) => entry.resource)
            )
          )
      )
    );
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
  }

  public get security(): ResourceSecurity[] {
    const resourceSecurity = getMetaSecurity(this.meta);
    const filtered = resourceSecurity.filter((next) => !next.inactive);
    const grouped = groupBy(filtered, (next) => next.type + next.id);
    const groupedKeys = Object.keys(grouped);

    return groupedKeys.map((groupedKey) => {
      const group = grouped[groupedKey];
      const next = new ResourceSecurity();
      next.type = group[0].type;
      next.id = group[0].id;

      if (next.type === 'group' && this.groupsBundle) {
        const foundGroupEntry = (this.groupsBundle.entry || []).find((entry) => entry.resource.id === next.id);

        if (foundGroupEntry) {
          next.display = (<Group>foundGroupEntry.resource).name;
        }
      }

      if (next.type === 'user' && this.usersBundle) {
        const foundUserEntry = (this.usersBundle.entry || []).find((entry) => entry.resource.id === next.id);

        if (foundUserEntry) {
          const humanNames = (<Practitioner>foundUserEntry.resource).name;
          next.display = getHumanNamesDisplay(humanNames);
        }
      }

      next.canRead = !!group.find((nextSub) => nextSub.permission === 'read');
      next.canWrite = !!group.find((nextSub) => nextSub.permission === 'write');
      return next;
    });
  }

  public get foundGroups(): Group[] {
    if (this.foundGroupsBundle) {
      return (this.foundGroupsBundle.entry || []).map((entry) => <Group> entry.resource);
    }

    return [];
  }

  public get foundUsers(): Practitioner[] {
    if (this.foundUsersBundle) {
      return (this.foundUsersBundle.entry || []).map((entry) => <Practitioner> entry.resource);
    }

    return [];
  }

  public searchGroups() {
    this.fhirService.search('Group', this.searchGroupsCriteria).toPromise()
      .then((results: Bundle) => this.foundGroupsBundle = results)
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }

  public searchUsers() {
    this.fhirService.search('Practitioner', this.searchUsersCriteria).toPromise()
      .then((results: Bundle) => this.foundUsersBundle = results)
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }

  public addPermission(type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string) {
    if (addPermission(this.meta, type, permission, id)) {
      this.getPermittedResources();
    }
  }

  public removePermission(type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string) {
    removePermission(this.meta, type, permission, id);
  }

  private getPermittedResources() {
    const resourceSecurity = getMetaSecurity(this.meta);
    const groupIds = resourceSecurity
      .filter((security) => security.type === 'group')
      .map((security) => security.id);
    const userIds = resourceSecurity
      .filter((security) => security.type === 'user')
      .map((security) => security.id);

    if (groupIds.length > 0) {
      this.fhirService.search('Group', null, null, null, groupIds.join(',')).toPromise()
        .then((results: Bundle) => this.groupsBundle = results)
        .catch((err) => this.message = this.fhirService.getErrorString(err));
    }

    if (userIds.length > 0) {
      this.fhirService.search('Practitioner', null, null, null, userIds.join(',')).toPromise()
        .then((results: Bundle) => this.usersBundle = results)
        .catch((err) => this.message = this.fhirService.getErrorString(err));
    }
  }

  private findCurrentUserPermission(permission: 'read'|'write') {
    const resourceSecurity = getMetaSecurity(this.meta);

    return resourceSecurity.find((security) => {
      if (security.type === 'user' && security.id === this.currentUser.id) {
        return true;
      } else if (security.type === 'group' && this.groupsBundle) {
        return !!(this.groupsBundle.entry || []).find((entry) => {
          const group = <Group>entry.resource;
          return !!(group.member || []).find((member) => {
            if (!member.inactive && member.entity && member.entity.reference) {
              return member.entity.reference === `Practitioner/${this.currentUser.id}`;
            }

            return false;
          });
        });
      } else if (security.type === 'everyone') {
        return true;
      }

      return false;
    });
  }

  public selectCopyResource() {
    const modalRef = this.modal.open(FhirReferenceModalComponent, { size: 'lg' });

    modalRef.result.then((results) => {
      this.copyResource = results.resource;
    });
  }

  public copyPermissions() {
    if (!this.copyResource) {
      return;
    }

    if (this.copyResource.meta && this.copyResource.meta.security && this.copyResource.meta.security.length > 0) {
      ensureSecurity(this.meta);

      this.meta.security = this.copyResource.meta.security;

      const meCanRead = this.findCurrentUserPermission('read');
      const meCanWrite = this.findCurrentUserPermission('write');

      if (!meCanRead) {
        this.addPermission('user', 'read', this.currentUser.id);
      }
      if (!meCanWrite) {
        this.addPermission('user', 'write', this.currentUser.id);
      }
    } else {
      alert('The selected resource does not have any permissions defined');
    }
  }

  ngOnInit() {
    this.getPermittedResources();

    this.practitionerService.getMe().toPromise()
      .then((currentUser: Practitioner) => this.currentUser = currentUser)
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }
}
