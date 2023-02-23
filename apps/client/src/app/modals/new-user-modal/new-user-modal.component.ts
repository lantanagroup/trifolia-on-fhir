import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { SocketService } from '../../shared/socket.service';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';
import { getErrorString } from '../../../../../../libs/tof-lib/src/lib/helper';
import { ConfigService } from '../../shared/config.service';
import { UserService } from '../../shared/user.service';
import type { IUser } from '@trifolia-fhir/models';

@Component({
  selector: 'trifolia-fhir-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.css']
})
export class NewUserModalComponent implements OnInit {
  public user: IUser;
  public message: string;
  public submitted: boolean = false;

  constructor(
    private configService: ConfigService,
    private socketService: SocketService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService) {

    this.user = {} as IUser;
    const identifierSystem = this.authService.userProfile && this.authService.userProfile.sub && this.authService.userProfile.sub.indexOf('auth0|') === 0 ?
      Globals.authNamespace : Globals.defaultAuthNamespace;
    let identifierValue = this.authService.userProfile ? this.authService.userProfile.sub || '' : '';

    if (identifierValue.indexOf('auth0|') === 0) {
      identifierValue = identifierValue.substring(6);
    }

    this.user.authId = [identifierValue];
  }

  public ok() {

    this.submitted = true;

    this.userService.create(this.user).subscribe({
      next: (newUser: IUser) => {
        this.authService.user = newUser;

        setTimeout(() => {
          this.socketService.notifyAuthenticated(this.authService.userProfile, newUser);
          this.authService.authChanged.emit();
          this.router.navigate([`/${this.configService.fhirServer}/home`]);
        });

      },
      error: (err) => { this.message = getErrorString(err); },
      complete: () => { this.submitted = false; }
    });

  }

  ngOnInit() {
  }

}
