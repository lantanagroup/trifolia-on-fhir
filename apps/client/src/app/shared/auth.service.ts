import {EventEmitter, Injectable, Injector} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as auth0 from 'auth0-js';
import {PractitionerService} from './practitioner.service';
import {Group, Meta, Practitioner} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ConfigService} from './config.service';
import {SocketService} from './socket.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {addPermission} from '../../../../../libs/tof-lib/src/lib/helper';
import {GroupService} from './group.service';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthService {
  // expiresIn is in seconds
  private readonly fiveMinutesInSeconds = 300;

  public auth0: any;
  public userProfile: any;
  public practitioner: Practitioner;
  public groups: Group[] = [];
  public authExpiresAt: number;
  public authChanged: EventEmitter<any>;
  public authError: string;
  public loggingIn = false;
  private authTimeout: any;

  constructor(
    private injector: Injector,
    private socketService: SocketService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private practitionerService: PractitionerService,
    private groupService: GroupService) {
    this.authExpiresAt = JSON.parse(localStorage.getItem('expires_at'));
    this.authChanged = new EventEmitter();
  }

  private get activatedRoute(): ActivatedRoute {
    return this.injector.get(ActivatedRoute);
  }

  public get router(): Router {
    return this.injector.get(Router);
  }

  public init() {
    if (this.authExpiresAt) {
      this.setSessionTimer();
    }

    if (this.configService.config && this.configService.config.auth) {
      this.auth0 = new auth0.WebAuth({
        clientID: this.configService.config.auth.clientId,
        domain: this.configService.config.auth.domain,
        responseType: 'token',
        redirectUri: location.origin + '/login?pathname=' + encodeURIComponent(location.pathname),
        scope: this.configService.config.auth.scope
      });
    }

    this.authChanged.subscribe(() => {
      if (this.isAuthenticated()) {
        this.socketService.notifyAuthenticated(this.userProfile, this.practitioner);
      }
    });

    // If the socket re-connects, then re-send the authentication information for the connection
    this.socketService.onConnected.subscribe(() => {
      if (this.isAuthenticated()) {
        this.socketService.notifyAuthenticated(this.userProfile, this.practitioner);
      }
    });

    // When the FHIR server changes, get the profile for the user on the FHIR server
    // and then notify the socket connection that the user has been authenticated
    this.configService.fhirServerChanged.subscribe(async () => {
      await this.getProfile();

      if (this.isAuthenticated()) {
        this.socketService.notifyAuthenticated(this.userProfile, this.practitioner);
      }
    });
  }

  public login(): void {
    if (!this.auth0) {
      return;
    }

    this.auth0.authorize();
  }

  public handleAuthentication() {
    if (!this.auth0) {
      return;
    }

    this.loggingIn = true;
    this.authError = undefined;

    this.auth0.parseHash((err, authResult) => {
      if (!err && authResult && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.getProfile()
          .then(() => {
            const path = this.activatedRoute.snapshot.queryParams.pathname || `/${this.configService.baseSessionUrl}/home`;

            this.authChanged.emit();
            this.socketService.notifyAuthenticated({
              userProfile: this.userProfile,
              practitioner: this.practitioner
            });

            if (path && path !== '/' && path !== '/logout' && path !== '/login') {
              // noinspection JSIgnoredPromiseFromCall
              this.router.navigate([path]);
            }
          })
          .catch(nextErr => this.authError = nextErr);
      } else if (err) {
        this.authError = err;
      }

      this.loggingIn = false;
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.userProfile = null;
    this.practitioner = null;
    this.authExpiresAt = null;
    this.socketService.authInfoSent = false;

    if (this.authTimeout) {
      clearTimeout(this.authTimeout);
    }

    if (this.auth0) {
      this.auth0.logout({
        returnTo: `${location.origin}/logout`
      });
    }

    // Go back to the home route
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate([`/${this.configService.fhirServer}/home`]);
    this.authChanged.emit();
  }

  public isAuthenticated(): boolean {
    return new Date().getTime() < this.authExpiresAt;
  }

  private async getAuthUserInfo(accessToken: string) {
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(accessToken, (userInfoErr, userProfile) => {
        if (userInfoErr) {
          reject(userInfoErr);
          return;
        }

        resolve(userProfile);
      });
    });
  }

  public async getProfile(): Promise<{ userProfile: any, practitioner: Practitioner }> {
    if (!this.auth0 || !this.isAuthenticated()) {
      return Promise.resolve({userProfile: null, practitioner: null});
    }

    const accessToken = localStorage.getItem('token');

    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    this.userProfile = await this.getAuthUserInfo(accessToken);

    try {
      this.practitioner = await this.practitionerService.getMe().toPromise();
    } catch (ex) {
      console.error(ex);
      this.practitioner = null;
    }

    try {
      this.groups = await this.groupService.getMembership()
        .pipe(map(groupsBundle =>
          (groupsBundle.entry || []).map(entry => <Group> entry.resource)
        ))
        .toPromise();
    } catch (ex) {
      console.error(ex);
      this.groups = [];
    }

    // This also triggers a notification to the socket
    this.authChanged.emit();

    return {
      userProfile: this.userProfile,
      practitioner: this.practitioner
    };
  }

  public getDefaultMeta(): Meta {
    const meta = new Meta();

    if (this.configService.project) {
      meta.security = this.configService.project.securityTags;
    }

    if (!meta.security || meta.security.length === 0) {
      addPermission(meta, 'everyone', 'write');
    }

    return meta;
  }

  private setSessionTimer() {
    if (!this.auth0) {
      return;
    }

    const expiresIn = (this.authExpiresAt - new Date().getTime()) / 1000;

    if (expiresIn > this.fiveMinutesInSeconds) {
      if (this.authTimeout) {
        clearTimeout(this.authTimeout);
      }

      const nextTimeout = (expiresIn - this.fiveMinutesInSeconds) * 1000;
      this.authTimeout = setTimeout(() => {
        this.authTimeout = null;
        this.auth0.checkSession({
          scope: this.configService.config.auth.scope
        }, (err, nextAuthResult) => {
          if (err) {
            console.log(err);
            alert('An error occurred while renewing your authentication session');
          } else {
            this.setSession(nextAuthResult);
          }
        });
      }, nextTimeout);
    }
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.authExpiresAt = JSON.parse(expiresAt);

    this.setSessionTimer();
  }
}
