import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {getErrorString, Globals} from '@trifolia-fhir/tof-lib';
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
  public searchUsersBundle;
  public editGroup: IGroup;
  public message: string;
  public Globals = Globals;
  public managingGroups: IGroup[] = [];
  public membershipGroups: IGroup[] = [];

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private groupService: GroupService,
    private authService: AuthService) {

  }

  public get searchUsersResults(): IUser[] {
    if (this.searchUsersBundle) {
      return (this.searchUsersBundle.results || []).map((entry) => <IUser> entry);
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
    const foundMember = this.editGroup.members.find((u) => u.id == user.id);

    if (!foundMember) {
      this.editGroup.members.push( user );
    }
  }

  public addGroup() {
    this.editGroup = { } ;
    const newMember = {name: this.user.name, id: this.user.id, managingUser: this.user  };
    this.editGroup.members.push(newMember);
  }

  public searchUsers() {
    this.userService.getUsers(null, this.searchUsersName, this.searchUsersEmail).toPromise()
      .then((results: IUser[]) => {
        this.searchUsersBundle = results;
        console.log(results[0])
      })
      .catch((err) => this.message = getErrorString(err));
  }

  public isAdmin(group: IGroup, currentMember?: IUser) {
   /* if (!currentMember) {
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

    return currentMember.admin === groupAdmin;*!/*/
    return false;
  }

  public async saveGroup() {
    if (!this.editGroup.id) {
      const results = await this.groupService.createManagingGroup(this.editGroup).toPromise();
      this.managingGroups.push(results);
      this.editGroup = null;
      this.message = 'New group has been saved!';
    } else {
      this.groupService.updateManagingGroup(this.editGroup).toPromise()
        .then((u) => {
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
