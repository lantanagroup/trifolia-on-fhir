import {Component, OnInit} from '@angular/core';
import {PractitionerService} from '../shared/practitioner.service';
import {Bundle, MemberComponent, Practitioner, ResourceReference} from '@trifolia-fhir/stu3';
import {Group} from '@trifolia-fhir/r4';
import {AuthService} from '../shared/auth.service';
import {getErrorString, getHumanNamesDisplay, Globals} from '@trifolia-fhir/tof-lib';
import {ConfigService} from '../shared/config.service';
import {GroupService} from '../shared/group.service';
import {IGroup, IUser} from '@trifolia-fhir/models';
import { UserService } from '../shared/user.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public user: IUser = {} as IUser;
  public searchUsersName: string;
  public searchUsersEmail: string;
  public searchUsersBundle: Bundle;
  public editGroup: IGroup = {} as IGroup;
  public message: string;
  public Globals = Globals;
  public managingGroups: IGroup[] = [];
  public membershipGroups: IGroup[] = [];

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private groupService: GroupService,
    private authService: AuthService,
    private practitionerService: PractitionerService) {

  }

  public get searchUserResults(): Practitioner[] {
    if (this.searchUsersBundle) {
      return (this.searchUsersBundle.entry || []).map((entry) => <Practitioner> entry.resource);
    }

    return [];
  }

  public saveUser() {
    this.message = 'Saving user...';

    this.userService.update(this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.message = 'Your changes have been saved!';
      },
      error: (err) => { this.message = 'Error saving user: ' + getErrorString(err) }
    });
  }

  public addMember(user: IUser) {
    const foundMember = this.editGroup.members.find((u) => u.id = user.id);

    if (!foundMember) {
      var myuser = {};
      myuser["name"] = "Sarah";
      myuser["auth"] = "63cf15917ed330706cec77fa"
      this.editGroup.members.push( user );
    }
  }

  public addGroup() {
    this.editGroup.name = "" //new Group();
/*
    const meReference = <ResourceReference> {
      reference: `Practitioner/${this.user.id}`,
      display: this.user.name
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

    this.editGroup.member = [newMember];*/
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
          reference: 'Practitioner/' + this.user.id
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
        .then((results) => {
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

  public deleteGroup(group: IGroup) {
    this.groupService.deleteManagingGroup(group).toPromise()
      .then(() => {
        const index = this.managingGroups.indexOf(group);
        this.managingGroups.splice(index, 1);
      })
      .catch((err) => this.message = getErrorString(err));
  }

  private getMe() {
    this.userService.getMe().subscribe({
      next: (u) => { this.user = u; },
      error: (e) => { this.message = getErrorString(e); }
    });
  }

  private async getGroups() {
    const results = await Promise.all([
      this.groupService.getManaging().toPromise(),
      this.groupService.getNewMembership().toPromise()
    ]);

    this.managingGroups = results[0] || [];
    this.membershipGroups = results[1] || [];

  }

  async ngOnInit() {
    this.authService.authChanged.subscribe(() => this.getMe());
    this.getMe();
    await this.getGroups();
  }
}
