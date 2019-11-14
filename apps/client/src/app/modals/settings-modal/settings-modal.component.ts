import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/config.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {
  public fhirServerId: string;

  constructor(
    public activeModal: NgbActiveModal,
    public configService: ConfigService,
    private router: Router) {

  }

  public get authCode(): string {
    return localStorage.getItem('token');
  }

  public ok() {
    if (this.fhirServerId !== this.configService.fhirServer) {
      this.configService.project = null;
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate([`/${this.fhirServerId}/home`]);
    }

    this.activeModal.close();
  }

  ngOnInit() {
    this.fhirServerId = this.configService.fhirServer;
  }
}
