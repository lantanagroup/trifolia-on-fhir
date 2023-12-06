import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/config.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';
import {AuthService} from '../../shared/auth.service';

@Component({
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {
  public fhirServerId: string;

  constructor(
    public activeModal: NgbActiveModal,
    public configService: ConfigService,
    private oauthService: OAuthService,
    private authService: AuthService,
    private router: Router) {

  }

  public get authCode(): string {
    return this.oauthService.hasValidIdToken() ? this.oauthService.getIdToken() : 'N/A';
  }

  public get exampleCurl(): string {
    return `curl -H "Authorization: Bearer ${this.authCode}" -H "fhirserver: ${this.fhirServerId}" ${location.origin}/api/fhir/ImplementationGuide`;
  }

  public copyToClipboard(value: string, messageEle: HTMLSpanElement) {
    const x = document.createElement('textarea') as HTMLTextAreaElement;
    x.value = value;
    document.body.appendChild(x);
    x.select();
    document.execCommand('copy');
    document.body.removeChild(x);

    messageEle.innerText = 'Copied!';
    setTimeout(() => messageEle.innerText = '', 3000);
  }

  public ok() {
    if (this.fhirServerId !== this.configService.fhirVersion) {
      this.configService.igContext = null;
      this.authService.user = null;
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate([`/${this.fhirServerId}/implementation-guide/open`]);
    }

    this.activeModal.close();
  }

  ngOnInit() {
    this.fhirServerId = this.configService.fhirVersion;
  }
}
