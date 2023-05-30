import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {getErrorString, Globals, Paginated} from '@trifolia-fhir/tof-lib';
import {ConfigService} from '../shared/config.service';
import {GroupService} from '../shared/group.service';
import {IGroup, IUser} from '@trifolia-fhir/models';
import { UserService } from '../shared/user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public user: IUser = {} as IUser;
  public searchUsersName: string;
  public searchUsersEmail: string;
  public searchUsersBundle: Paginated<IUser>;
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
    const foundMember = this.editGroup?.members?.find((u) => u.id == user.id);

    if (!foundMember) {
      this.editGroup.members.push( user );
    }
  }

  public addGroup() {
    this.editGroup = { } ;
    const newMember = {name: this.user.name, id: this.user.id, managingUser: this.user  };
    this.editGroup.managingUser = this.user;
    this.editGroup.members = this.editGroup.members || [];
    this.editGroup.members.push(newMember);
  }

  public searchUsers() {
    firstValueFrom(this.userService.getUsers(this.searchUsersName, this.searchUsersEmail))
      .then((results: Paginated<IUser>) => {
        this.searchUsersBundle = results;
        console.log(results[0])
      })
      .catch((err) => this.message = getErrorString(err));
  }


  public isAdmin(group: IGroup, currentMember?: IUser) {
    console.log("CurrentMember is: " + currentMember);
    if (!currentMember) {
      currentMember = this.user;
    }
    let  admin = group.managingUser.id === currentMember.id
    return admin;
  }


  public async saveGroup() {
    let results;
    if (!this.editGroup.id) {
      results = await this.groupService.createManagingGroup(this.editGroup).toPromise();
    } else {
      results = await this.groupService.updateManagingGroup(this.editGroup).toPromise();
    }
    this.managingGroups.push(results);
    this.editGroup = null;
    this.message = 'New group has been saved!';
    await this.getGroups();
  }

  public deleteGroup(group: IGroup) {
    this.groupService.deleteManagingGroup(group).toPromise()
      .then(async () => {
        const index = this.managingGroups.indexOf(group);
        this.managingGroups.splice(index, 1);
        await this.getGroups();
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
      this.groupService.getMembership().toPromise()
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
