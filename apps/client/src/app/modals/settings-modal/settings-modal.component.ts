import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/config.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {
  public fhirServerId: string;

  constructor(
    public activeModal: NgbActiveModal,
    public configService: ConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

  }

  public get authCode(): string {
    return localStorage.getItem('token');
  }

  public ok() {
    if (this.fhirServerId !== this.configService.fhirServer) {
      const url = this.router.url.substring(this.router.url.startsWith('/') ? 1 : 0);
      const urlParts = url.split('/');
      const foundCurrentServer = urlParts.length > 0 ?
        this.configService.config.fhirServers.find((fhirServer) => fhirServer.id === urlParts[0]) :
        null;

      if (foundCurrentServer) {
        urlParts[0] = this.fhirServerId;
        this.router.navigate([urlParts.join('/')]);
      } else {
        this.configService.changeFhirServer(this.fhirServerId);
      }
    }

    this.activeModal.close();
  }

  ngOnInit() {
    this.fhirServerId = this.configService.fhirServer;
  }
}
