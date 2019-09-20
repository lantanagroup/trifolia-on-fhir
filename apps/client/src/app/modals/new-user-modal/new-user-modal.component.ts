import {Component, OnInit} from '@angular/core';
import {HumanName, Identifier, Practitioner} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {PractitionerService} from '../../shared/practitioner.service';
import {Router} from '@angular/router';
import {FhirService} from '../../shared/fhir.service';
import {AuthService} from '../../shared/auth.service';
import {SocketService} from '../../shared/socket.service';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from '../../shared/config.service';

@Component({
  selector: 'trifolia-fhir-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.css']
})
export class NewUserModalComponent implements OnInit {
  public practitioner;
  public message: string;

  constructor(
    private configService: ConfigService,
    private socketService: SocketService,
    private authService: AuthService,
    private router: Router,
    private fhirService: FhirService,
    private practitionerService: PractitionerService) {

    this.practitioner = new Practitioner();
    const identifierSystem = this.authService.userProfile && this.authService.userProfile.user_id && this.authService.userProfile.user_id.indexOf('auth0|') === 0 ?
      Globals.authNamespace : 'https://trifolia-fhir.lantanagroup.com';
    const identifierValue = this.authService.userProfile && this.authService.userProfile.user_id && this.authService.userProfile.user_id.indexOf('auth0|') === 0 ?
      this.authService.userProfile.user_id.substring(6) : this.authService.userProfile.user_id;
    this.practitioner.identifier = [new Identifier({
      system: identifierSystem,
      value: identifierValue
    })];
    this.practitioner.name = [];
    this.practitioner.name.push(new HumanName({
      family: '',
      given: ['']
    }));
  }

  public ok() {
    this.practitionerService.updateMe(this.practitioner)
      .subscribe((updated) => {
        this.authService.practitioner = updated;

        setTimeout(() => {
          this.socketService.notifyAuthenticated(this.authService.userProfile, updated);
          this.authService.authChanged.emit();
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`/${this.configService.fhirServer}/home`]);
        });
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  ngOnInit() {
  }

  public get okDisabled(): boolean {
    return !(this.practitioner &&
      this.practitioner.name &&
      this.practitioner.name.length > 0 &&
      this.practitioner.name[0].given &&
      this.practitioner.name[0].given.length > 0 &&
      this.practitioner.name[0].given[0] &&
      this.practitioner.name[0].family);
  }
}
