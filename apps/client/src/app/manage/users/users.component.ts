import {Component, OnInit} from '@angular/core';
import {ManageService} from '../../shared/manage.service';
import {ActiveUserModel, getAuthIdIdentifier, getAuthIdSource} from '@trifolia-fhir/tof-lib';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MergeUserModalComponent} from '../merge-user-modal/merge-user-modal.component';
import type { IUser } from '@trifolia-fhir/models';

@Component({
  selector: 'trifolia-fhir-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  activeUsers: ActiveUserModel[];
  users: IUser[];
  totalUsers: number;
  usersPage = 1;
  usersPageChanged = new Subject();
  searchUsersName: string;

  getAuthIdIdentifier = getAuthIdIdentifier;
  getAuthIdSource = getAuthIdSource;

  constructor(private manageService: ManageService, private modal: NgbModal) {
    this.usersPageChanged.subscribe(() => this.refreshUsers());
  }

  async usersCriteriaChanged() {
    this.usersPage = 1;
    await this.refreshUsers();
  }

  mergeUser(user: IUser) {
    const modalRef = this.modal.open(MergeUserModalComponent, { size: 'lg' });
    modalRef.componentInstance.sourceUser = user;
    modalRef.result.then(() => this.refreshUsers());
  }

  async refreshUsers() {
    this.users = [];

    const res = await this.manageService.getUsers(this.searchUsersName, 10, this.usersPage);

    this.users = res.results;
    this.totalUsers = res.total;
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
