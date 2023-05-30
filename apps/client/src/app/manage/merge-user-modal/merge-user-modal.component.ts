import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {getAuthIdIdentifier, getAuthIdSource, Paginated} from '@trifolia-fhir/tof-lib';
import {ManageService} from '../../shared/manage.service';
import { IUser } from '@trifolia-fhir/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'trifolia-fhir-merge-user-modal',
  templateUrl: './merge-user-modal.component.html',
  styleUrls: ['./merge-user-modal.component.css']
})
export class MergeUserModalComponent implements OnInit {
  @Input() sourceUser: IUser;
  targetUser: IUser;
  usersPage = 1;
  usersPageChanged = new Subject();
  usersPageSize = 5;
  searchUsersName: string;
  searchUsersResults: Paginated<IUser>;
  message: string;
  
  getAuthIdIdentifier = getAuthIdIdentifier;
  getAuthIdSource = getAuthIdSource;

  constructor(public activeModal: NgbActiveModal, private manageService: ManageService) { 
    this.usersPageChanged.subscribe(() => this.searchUsers());
  }

  async ok() {
    try {
      await this.manageService.mergeUsers(this.sourceUser.id, this.targetUser.id);
      this.activeModal.close();
    } catch (ex) {
      this.message = ex.message;
    }
  }

  async searchUsers() {
    this.targetUser = null;

    try {
      this.searchUsersResults = await this.manageService.getUsers(this.searchUsersName);
    } catch (ex) {
      this.message = ex.message;
    }
  }

  async ngOnInit() {

    this.searchUsersName = this.sourceUser.lastName;
    await this.searchUsers();

  }

}
