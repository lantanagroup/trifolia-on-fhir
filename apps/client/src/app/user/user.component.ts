import {Component, OnInit} from '@angular/core';
import {PractitionerService} from '../shared/practitioner.service';
import {Bundle, MemberComponent, Practitioner, ResourceReference} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Group} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {AuthService} from '../shared/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../shared/fhir.service';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {ConfigService} from '../shared/config.service';
import {getHumanNamesDisplay} from '../../../../../libs/tof-lib/src/lib/helper';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private allGroupsBundle: Bundle;

  public practitioner = new Practitioner();
  public searchUsersCriteria: string;
  public searchUsersBundle: Bundle;
  public editGroup: Group;
  public message: string;
  public Globals = Globals;

  constructor(
    private configService: ConfigService,
    private modalService: NgbModal,
    private personService: PractitionerService,
    private authService: AuthService,
    private fhirService: FhirService) {

  }

  public get searchUserResults(): Practitioner[] {
    if (this.searchUsersBundle) {
      return (this.searchUsersBundle.entry || []).map((entry) => <Practitioner> entry.resource);
    }

    return [];
  }

  public get managingGroups(): Group[] {
    if (this.allGroupsBundle) {
      return (this.allGroupsBundle.entry || [])
        .filter((entry) => {
          const group = <Group> entry.resource;

          if (this.configService.isFhirSTU3) {
            return !!(group.extension || []).find((extension) => {
              return extension.url === Globals.extensionUrls['extension-group-manager'] &&
                extension.valueReference &&
                extension.valueReference.reference === `Practitioner/${this.practitioner.id}`;
            });
          } else if (this.configService.isFhirR4) {
            return group.managingEntity && group.managingEntity.reference === `Practitioner/${this.practitioner.id}`;
          }

          return false;
        })
        .map((entry) => <Group> entry.resource);
    }

    return [];
  }

  public get memberGroups() {
    if (this.allGroupsBundle) {
      const managingGroups = this.managingGroups;

      return (this.allGroupsBundle.entry || [])
        .filter((entry) => {
          const group = <Group> entry.resource;
          return managingGroups.indexOf(group) < 0;
        })
        .map((entry) => <Group> entry.resource);
    }

    return [];
  }

  public saveUser() {
    this.message = 'Saving person...';

    this.personService.updateMe(this.practitioner)
      .subscribe((updatedPractitioner) => {
        this.practitioner = updatedPractitioner;
        this.message = 'Your changes have been saved!';
      }, err => {
        this.message = 'Error saving practitioner: ' + this.fhirService.getErrorString(err);
      });
  }

  public addMember(user: Practitioner) {
    const reference = <ResourceReference> {
      reference: `Practitioner/${user.id}`,
      display: getHumanNamesDisplay(user.name)
    };
    this.editGroup.member.push({
      entity: reference
    });
  }

  public addGroup() {
    this.editGroup = new Group();

    const meReference = <ResourceReference> {
      reference: `Practitioner/${this.practitioner.id}`,
      display: getHumanNamesDisplay(this.practitioner.name)
    };

    const newMember = new MemberComponent();
    newMember.entity = meReference;

    if (this.configService.isFhirSTU3) {
      this.editGroup.extension = [{
        url: Globals.extensionUrls['extension-group-manager'],
        valueReference: meReference
      }];
    } else if (this.configService.isFhirR4) {
      this.editGroup.managingEntity = meReference;
    }

    this.editGroup.member = [newMember];
  }

  public searchUsers() {
    this.fhirService.search('Practitioner', this.searchUsersCriteria).toPromise()
      .then((results: Bundle) => this.searchUsersBundle = results)
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }

  public saveGroup() {
    if (!this.editGroup.id) {
      this.fhirService.create(this.editGroup).toPromise()
        .then((results: Group) => {
          if (!this.allGroupsBundle.entry) {
            this.allGroupsBundle.entry = [];
          }

          this.allGroupsBundle.entry.push({
            resource: results
          });

          this.message = 'New group has been saved!';
        })
        .catch((err) => this.message = this.fhirService.getErrorString(err));
    } else {
      this.fhirService.update('Group', this.editGroup.id, this.editGroup).toPromise()
        .then(() => this.message = 'Group has been updated!')
        .catch((err) => this.message = this.fhirService.getErrorString(err));
    }
  }

  public deleteGroup(group: Group) {
    this.fhirService.delete('Group', group.id).toPromise()
      .then(() => {
        const index = this.allGroupsBundle.entry.indexOf(group);
        this.allGroupsBundle.entry.splice(index, 1);
      })
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }

  private getMe() {
    this.personService.getMe().toPromise()
      .then((practitioner) => {
        this.practitioner = practitioner;

        const reference = `Practitioner/${this.practitioner.id}`;
        return this.fhirService.search('Group', null, null, null, null, { member: reference }).toPromise();
      })
      .then((groupsBundle: Bundle) => {
        this.allGroupsBundle = groupsBundle;
      })
      .catch((err) => this.message = this.fhirService.getErrorString(err));
  }

  ngOnInit() {
    this.authService.authChanged.subscribe(() => this.getMe());
    this.getMe();
  }
}
