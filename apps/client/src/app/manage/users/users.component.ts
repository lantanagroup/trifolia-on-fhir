import {Component, OnInit} from '@angular/core';
import {ManageService} from '../../shared/manage.service';
import {ActiveUserModel} from '../../../../../../libs/tof-lib/src/lib/active-user-model';
import {UserModel} from '../../../../../../libs/tof-lib/src/lib/user-model';
import {getAliasName, getDisplayIdentifier, getDisplayName, getIdentifierSource} from '../../../../../../libs/tof-lib/src/lib/helper';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MergeUserModalComponent} from '../merge-user-modal/merge-user-modal.component';

@Component({
  selector: 'trifolia-fhir-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  activeUsers: ActiveUserModel[];
  users: UserModel[];
  totalUsers: number;
  usersPage = 1;
  usersPageChanged = new Subject<void>();
  searchUsersName: string;

  getDisplayName = getDisplayName;
  getDisplayIdentifier = getDisplayIdentifier;
  getIdentifierSource = getIdentifierSource;
  getAliasName = getAliasName;

  constructor(private manageService: ManageService, private modal: NgbModal) {
    this.usersPageChanged.subscribe(() => this.refreshUsers());
  }

  async usersCriteriaChanged() {
    this.usersPage = 1;
    await this.refreshUsers();
  }

  mergeUser(user: UserModel) {
    const modalRef = this.modal.open(MergeUserModalComponent, { size: 'lg' });
    modalRef.componentInstance.sourceUser = user;
    modalRef.result.then(() => this.refreshUsers());
  }

  async refreshUsers() {
    this.users = [];
    const userResults = await this.manageService.getUsers(this.searchUsersName, 10, this.usersPage);
    this.users = userResults.users;

    if (!userResults.hasOwnProperty('total') && userResults.hasMore) {
      this.totalUsers = (this.users.length * this.usersPage) + 10;
    } else {
      this.totalUsers = userResults.total;
    }
  }

  async refresh() {
    this.activeUsers = [];
    this.activeUsers = await this.manageService.getActiveUsers();

    await this.refreshUsers();
  }

  broadcastMessage(message: string) {
    this.manageService.sendMessageToActiveUsers(message);
  }

  ngOnInit() {
    this.refresh();
  }
}
