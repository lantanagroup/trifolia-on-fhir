import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {getAliasName, getDisplayIdentifier, getDisplayName, getIdentifierSource} from '../../../../../../libs/tof-lib/src/lib/helper';
import {ManageService} from '../../shared/manage.service';
import {GetUsersModel} from '../../../../../../libs/tof-lib/src/lib/get-users-model';
import {UserModel} from '../../../../../../libs/tof-lib/src/lib/user-model';
import {FhirService} from '../../shared/fhir.service';

@Component({
  selector: 'trifolia-fhir-merge-user-modal',
  templateUrl: './merge-user-modal.component.html',
  styleUrls: ['./merge-user-modal.component.css']
})
export class MergeUserModalComponent implements OnInit {
  @Input() sourceUser: UserModel;
  targetUser: UserModel;
  searchUsersName: string;
  searchUsersResults: GetUsersModel;
  message: string;

  getDisplayName = getDisplayName;
  getDisplayIdentifier = getDisplayIdentifier;
  getAliasName = getAliasName;
  getIdentifierSource = getIdentifierSource;

  constructor(public activeModal: NgbActiveModal, private manageService: ManageService, private fhirService: FhirService) { }

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
    const official = (this.sourceUser.name || []).find(n => n.use === 'official' || !n.use);

    if (official && official.family) {
      this.searchUsersName = official.family;
      await this.searchUsers();
    }
  }

}
