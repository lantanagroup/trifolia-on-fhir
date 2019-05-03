import {Component, Input, OnInit} from '@angular/core';
import {Bundle, DomainResource, Group, Practitioner} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {FhirService} from '../../shared/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirReferenceModalComponent} from '../../fhir-edit/reference-modal/reference-modal.component';
import {PractitionerService} from '../../shared/practitioner.service';
import {addPermission, ensureSecurity, getHumanNamesDisplay, getResourceSecurity, groupBy, removePermission} from '../../../../../../libs/tof-lib/src/lib/helper';
import {resource} from 'selenium-webdriver/http';
import {ResourceSecurityModel} from '../../../../../../libs/tof-lib/src/lib/resource-security-model';

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
  @Input() resource: DomainResource;

  public groupsBundle: Bundle;
  public usersBundle: Bundle;
  public foundGroupsBundle: Bundle;
  public foundUsersBundle: Bundle;
  public message: string;
  public Globals = Globals;

  private currentUser: Practitioner;

  constructor(
    private practitionerService: PractitionerService,
    private fhirService: FhirService,
    private modal: NgbModal) {

  }

  public get security(): ResourceSecurity[] {
    const resourceSecurity = getResourceSecurity(this.resource);
    const grouped = groupBy(resourceSecurity, (next) => next.type + next.id);
    const groupKeys = Object.keys(grouped);

    return groupKeys.map((groupKey) => {
      const group: ResourceSecurityModel[] = grouped[groupKey];
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
    this.fhirService.search('Group').toPromise()
      .then((results: Bundle) => this.foundGroupsBundle = results)
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }

  public searchUsers() {
    this.fhirService.search('Practitioner').toPromise()
      .then((results: Bundle) => this.foundUsersBundle = results)
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }

  public getPractitionerEmail(practitioner: Practitioner) {
    const foundEmail = (practitioner.telecom || []).find((telecom) => telecom.system === 'email');

    if (foundEmail && foundEmail.value) {
      return foundEmail.value.replace('mailto:', '');
    }
  }

  public addPermission(type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string) {
    if (addPermission(this.resource, type, permission, id)) {
      this.getPermittedResources();
    }
  }

  public removePermission(type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string) {
    removePermission(this.resource, type, permission, id);
  }

  private getPermittedResources() {
    const resourceSecurity = getResourceSecurity(this.resource);
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

  public copyPermissionsFrom() {
    const modalRef = this.modal.open(FhirReferenceModalComponent);

    modalRef.result.then((results) => {
      if (results.resource && results.resource.meta && results.resource.meta.security) {
        ensureSecurity(this.resource);

        this.resource.meta.security = results.resource.meta.security;

        const resourceSecurity = getResourceSecurity(this.resource);
        const meExists = resourceSecurity.find((security) => {
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

        if (!meExists) {
          this.addPermission('user', 'write', this.currentUser.id);
        }
      }
    });
  }

  ngOnInit() {
    this.getPermittedResources();

    this.practitionerService.getMe().toPromise()
      .then((currentUser: Practitioner) => this.currentUser = currentUser)
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }
}
