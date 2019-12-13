import { Component, OnInit } from '@angular/core';
import {ManageService} from '../../shared/manage.service';
import {ActiveUserModel} from '../../../../../../libs/tof-lib/src/lib/active-user-model';
import {UserModel} from '../../../../../../libs/tof-lib/src/lib/user-model';

@Component({
  selector: 'trifolia-fhir-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  activeUsers: ActiveUserModel[];
  users: UserModel[];

  constructor(private manageService: ManageService) { }

  async refresh() {
    this.activeUsers = [];
    this.activeUsers = await this.manageService.getActiveUsers();

    this.users = [];
    this.users = await this.manageService.getUsers();
  }

  broadcastMessage(message: string) {
    this.manageService.sendMessageToActiveUsers(message);
  }

  ngOnInit() {
    this.refresh();
  }
}
