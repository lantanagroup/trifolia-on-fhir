import {Component, OnInit} from '@angular/core';
import {PractitionerService} from '../shared/practitioner.service';
import {Bundle, MemberComponent, Practitioner, ResourceReference} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Group} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {AuthService} from '../shared/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../shared/fhir.service';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {ConfigService} from '../shared/config.service';
import {getErrorString, getHumanNamesDisplay, getPractitionerEmail} from '../../../../../libs/tof-lib/src/lib/helper';
import {GroupService} from '../shared/group.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public practitioner = new Practitioner();
  public searchUsersName: string;
  public searchUsersEmail: string;
  public searchUsersBundle: Bundle;
  public editGroup: Group;
  public message: string;
  public Globals = Globals;
  public getHumanNamesDisplay = getHumanNamesDisplay;
  public getPractitionerEmail = getPractitionerEmail;
  public managingGroups: Group[] = [];
  public membershipGroups: Group[] = [];

  constructor(
    private configService: ConfigService,
    private modalService: NgbModal,
    private personService: PractitionerService,
    private groupService: GroupService,
    private authService: AuthService,
    private fhirService: FhirService,
    private practitionerService: PractitionerService) {

  }

  public get searchUserResults(): Practitioner[] {
    if (this.searchUsersBundle) {
      return (this.searchUsersBundle.entry || []).map((entry) => <Practitioner> entry.resource);
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
        this.message = 'Error saving practitioner: ' + getErrorString(err);
      });
  }

  public addMember(practitioner: Practitioner) {
    const foundMember = this.editGroup.member.find((next) => next.entity.reference === 'Practitioner/' + practitioner.id);

    if (!foundMember) {
      const reference = <ResourceReference>{
        reference: `Practitioner/${practitioner.id}`,
        display: getHumanNamesDisplay(practitioner.name)
      };
      this.editGroup.member.push({
        entity: reference
      });
    }
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
      newMember.extension = [{
        url: Globals.extensionUrls['extension-group-manager'],
        valueBoolean: true
      }]
    } else if (this.configService.isFhirR4) {
      this.editGroup.managingEntity = meReference;
    }

    this.editGroup.member = [newMember];
  }

  public searchUsers() {
    this.practitionerService.getUsers(null, this.searchUsersName, this.searchUsersEmail).toPromise()
      .then((results: Bundle) => this.searchUsersBundle = results)
      .catch((err) => this.message = getErrorString(err));
  }

  public isAdmin(group: Group, currentMember?: MemberComponent) {
    if (!currentMember) {
      currentMember = {
        entity: {
          reference: 'Practitioner/' + this.practitioner.id
        }
      };
    }

    let groupAdmin: string;

    if (this.configService.isFhirSTU3) {
      const foundMemberAdmin = group.member.find((member) => {
        return !!(member.extension || []).find((ext) => ext.url === Globals.extensionUrls['extension-group-manager'] && ext.valueBoolean);
      });

      if (foundMemberAdmin) {
        groupAdmin = foundMemberAdmin.entity.reference;
      }
    } else if (this.configService.isFhirR4 && group.managingEntity) {
      groupAdmin = group.managingEntity.reference;
    }

    return currentMember.entity.reference === groupAdmin;
  }

  public saveGroup() {
    if (!this.editGroup.id) {
      this.groupService.createManagingGroup(this.editGroup).toPromise()
        .then((results: Group) => {
          this.managingGroups.push(results);
          this.message = 'New group has been saved!';
          this.editGroup = null;
        })
        .catch((err) => this.message = getErrorString(err));
    } else {
      this.groupService.updateManagingGroup(this.editGroup).toPromise()
        .then(() => {
          this.message = 'Group has been updated!';
          this.editGroup = null;
        })
        .catch((err) => this.message = getErrorString(err));
    }
  }

  public deleteGroup(group: Group) {
    this.groupService.deleteManagingGroup(group).toPromise()
      .then(() => {
        const index = this.managingGroups.indexOf(group);
        this.managingGroups.splice(index, 1);
      })
      .catch((err) => this.message = getErrorString(err));
  }

  private getMe() {
    this.personService.getMe().toPromise()
      .then((practitioner) => {
        this.practitioner = practitioner;
      })
      .catch((err) => this.message = getErrorString(err));
  }

  private async getGroups() {
    const results = await Promise.all([
      this.groupService.getManaging().toPromise(),
      this.groupService.getMembership().toPromise()
    ]);

    this.managingGroups = results[0].entry.map((entry) => <Group> entry.resource);
    this.membershipGroups = results[1].entry.map((entry) => <Group> entry.resource);
  }

  async ngOnInit() {
    this.authService.authChanged.subscribe(() => this.getMe());
    this.getMe();
    await this.getGroups();
  }
}
