import { Component, OnInit } from '@angular/core';
import {ManageService} from '../../shared/manage.service';
import {ActiveUserModel} from '../../../../../../libs/tof-lib/src/lib/active-user-model';
import {UserModel} from '../../../../../../libs/tof-lib/src/lib/user-model';
import {getDisplayIdentifier, getDisplayName} from '../../../../../../libs/tof-lib/src/lib/helper';
import {Subject} from 'rxjs';

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
  usersPageChanged = new Subject();

  getDisplayName = getDisplayName;
  getDisplayIdentifier = getDisplayIdentifier;

  constructor(private manageService: ManageService) {
    this.usersPageChanged.subscribe(() => this.refreshUsers());
  }

  async refreshUsers() {
    this.users = [];
    const userResults = await this.manageService.getUsers(10, this.usersPage);
    this.users = userResults.users;
    this.totalUsers = userResults.total;
  }

  async refresh() {
    this.activeUsers = [];
    this.activeUsers = await this.manageService.getActiveUsers();

    this.refreshUsers();
  }

  broadcastMessage(message: string) {
    this.manageService.sendMessageToActiveUsers(message);
  }

  ngOnInit() {
    this.refresh();
  }
}
