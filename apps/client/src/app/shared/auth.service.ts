import {EventEmitter, Injectable, Injector} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PractitionerService} from './practitioner.service';
import {Group, HumanName, Identifier, Meta, Practitioner} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ConfigService} from './config.service';
import {SocketService} from './socket.service';
import {NewUserModalComponent} from '../modals/new-user-modal/new-user-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {addPermission} from '../../../../../libs/tof-lib/src/lib/helper';
import {GroupService} from './group.service';
import {map} from 'rxjs/operators';

import {OAuthService, OAuthErrorEvent, AuthConfig} from 'angular-oauth2-oidc'; // Add this import

@Injectable()
export class AuthService {
  // expiresIn is in seconds
  private readonly fiveMinutesInSeconds = 300;

  public userProfile: any;
  public practitioner: Practitioner;
  public groups: Group[] = [];
  public authExpiresAt: number;
  public authChanged: EventEmitter<any>;
  private authTimeout: any;

  constructor(
    private injector: Injector,
    private socketService: SocketService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private practitionerService: PractitionerService,
    private groupService: GroupService,
    private oauthService: OAuthService) {

    this.authExpiresAt = JSON.parse(localStorage.getItem('expires_at'),);
    this.authChanged = new EventEmitter();
  }

  private get activatedRoute(): ActivatedRoute {
    return this.injector.get(ActivatedRoute);
  }

  public get router(): Router {
    return this.injector.get(Router);
  }

  public init() {

    const authConfig: AuthConfig = {};
    authConfig.issuer = this.configService.config.auth.issuer;
    authConfig.clientId = this.configService.config.auth.clientId;
    authConfig.redirectUri = window.location.origin + '/login';
    authConfig.logoutUrl = window.location.origin + '/logout';
    authConfig.silentRefreshRedirectUri = window.location.origin + '/silent-refresh.html';
    authConfig.scope = this.configService.config.auth.scope,
    this.oauthService.configure(authConfig)

    // For debugging:
    //this.oauthService.events.subscribe(e => e instanceof OAuthErrorEvent ? console.error(e) : console.warn(e));

    this.oauthService.loadDiscoveryDocument()

    // See if the hash fragment contains tokens (when user got redirected back)
    .then(() => this.oauthService.tryLogin())

    // If we're still not logged in yet, try with a silent refresh:
    .then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
        return this.oauthService.silentRefresh();
      }
    })

    // Set the user session and context
    .then(() => {
      this.handleAuthentication();
    });

    this.oauthService.setupAutomaticSilentRefresh();

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
    if (!this.oauthService) {
      return;
    }

    this.oauthService.initImplicitFlow();
  }

  public handleAuthentication(): void {
    if (!this.oauthService) {
      return;
    }

    if(this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()){
      window.location.hash = '';
      this.setSession();

      let path = this.activatedRoute.snapshot.queryParams.pathname || `/${this.configService.fhirServer}/home`;

      // Make sure the user is not sent back to the /login page, which is only used to active .handleAuthentication()
      if (path.startsWith('/login')) {
        path = '/';
      }

      this.router.navigate([path]);
      this.authChanged.emit();
      this.socketService.notifyAuthenticated({
        userProfile: this.userProfile,
        practitioner: this.practitioner
      });
    }
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

    if (this.oauthService) {
      this.oauthService.logOut();
    }

    // Go back to the home route
    this.router.navigate(['/']);
    this.authChanged.emit();
  }

  public isAuthenticated(): boolean {
    return new Date().getTime() < this.authExpiresAt;
  }

  private getAuthUserInfo() : Object {

    if(this.oauthService.hasValidIdToken()){
      return this.oauthService.getIdentityClaims();
    }
  }

  public async getProfile(): Promise<{ userProfile: any, practitioner: Practitioner }> {
    if (!this.isAuthenticated()) {
      return Promise.resolve({userProfile: null, practitioner: null});
    }

    this.userProfile = this.getAuthUserInfo();

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
    if (this.practitioner && this.configService.config.enableSecurity) {
      addPermission(meta, 'user', 'write', this.practitioner.id);
    }
    return meta;
  }


  private setSession(): void {

    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(this.oauthService.getAccessTokenExpiration());
    localStorage.setItem('token', this.oauthService.getAccessToken());
    localStorage.setItem('id_token', this.oauthService.getIdToken());
    localStorage.setItem('expires_at', expiresAt);
    this.authExpiresAt = this.oauthService.getAccessTokenExpiration();

  }
}
