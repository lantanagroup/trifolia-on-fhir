import {EventEmitter, Injectable, Injector, ComponentFactoryResolver} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PractitionerService} from './practitioner.service';
import {Group, Meta, Practitioner} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ConfigService} from './config.service';
import {SocketService} from './socket.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {addPermission} from '../../../../../libs/tof-lib/src/lib/helper';
import {GroupService} from './group.service';
import {map} from 'rxjs/operators';
import {AuthConfig, OAuthService, OAuthEvent} from 'angular-oauth2-oidc';
import {ITofUser} from '../../../../../libs/tof-lib/src/lib/tof-user';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class AuthService {
  public userProfile: ITofUser;
  public practitioner: Practitioner;
  public groups: Group[] = [];
  public authChanged: EventEmitter<any>;
  public loggingIn = false;

  constructor(
    private injector: Injector,
    private socketService: SocketService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private practitionerService: PractitionerService,
    private groupService: GroupService,
    private oauthService: OAuthService) {

    this.authChanged = new EventEmitter();
  }

  /**
   * This is handled manually instead of with automatic dependency injection because there
   * are circular dependencies. Using the injector allows us to bypass those circular dependencies
   * until run-time.
   */
  private get activatedRoute(): ActivatedRoute {
    return this.injector.get(ActivatedRoute);
  }

  /**
   * This is handled manually instead of with automatic dependency injection because there
   * are circular dependencies. Using the injector allows us to bypass those circular dependencies
   * until run-time.
   */
  public get router(): Router {
    return this.injector.get(Router);
  }

  public init() {
    const authConfig: AuthConfig = {};
    authConfig.issuer = this.configService.config.auth.issuer;
    authConfig.clientId = this.configService.config.auth.clientId;
    authConfig.redirectUri = window.location.origin + '/login';
    //authConfig.logoutUrl = window.location.origin + '/logout';
    authConfig.silentRefreshRedirectUri = window.location.origin + '/silent-refresh.html';
    authConfig.scope = this.configService.config.auth.scope;
    authConfig.requireHttps = false;
    authConfig.requestAccessToken = true;

    this.oauthService.configure(authConfig);


    // For debugging:
    //this.oauthService.events.subscribe(e => e instanceof OAuthErrorEvent ? console.error(e) : console.warn(e));

    this.oauthService.loadDiscoveryDocumentAndTryLogin({
      onTokenReceived: () => this.router.navigateByUrl(decodeURIComponent(this.oauthService.state)),
    })
      .then(() => {
        // Set the user session and context
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
    this.oauthService.initImplicitFlow(encodeURIComponent(this.router.url));
  }

  public handleAuthentication(): void {
    if (!this.oauthService) {
      return;
    }

    if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {

      window.location.hash = '';
      let path;
      if(!this.oauthService.state || this.oauthService.state !== 'undefined'){
        path = this.oauthService.state;
      }else{
        path = this.activatedRoute.snapshot.queryParams.pathname || `/${this.configService.fhirServer}/home`;
      }

      // Make sure the user is not sent back to the /login page, which is only used to active .handleAuthentication()
      if (path.startsWith('/login')) {
        //path = '/';
        path = this.activatedRoute.snapshot.queryParams.pathname || `/${this.configService.fhirServer}/home`;
      }

      if (path && path !== '/' && path !== '/logout' && path !== '/login') {
        this.router.navigate([path]);
      }

      this.authChanged.emit();
      this.getProfile();
      this.socketService.notifyAuthenticated({
        userProfile: this.userProfile,
        practitioner: this.practitioner
      });
    }
  }

  public logout(): void {
    if (this.oauthService) {
      this.oauthService.logOut();
    }

    // Go back to the home route
    // noinspection JSIgnoredPromiseFromCall

    this.router.navigate([`/${this.configService.fhirServer}/home`]);
    this.authChanged.emit();
  }

  public isAuthenticated(): boolean {
    return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
  }

  private getAuthUserInfo(): ITofUser {
    if (this.oauthService.hasValidIdToken()) {
      const userProfile = <ITofUser> this.oauthService.getIdentityClaims();

      if (userProfile.roles && userProfile.roles.indexOf('admin') >= 0) {
        userProfile.isAdmin = true;
      } else {
        userProfile.isAdmin = false;
      }

      return userProfile;
    }
  }

  public async getProfile(): Promise<{ userProfile: any, practitioner: Practitioner }> {
    if (!this.isAuthenticated()) {
      return Promise.resolve({ userProfile: null, practitioner: null });
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
          (groupsBundle.entry || []).map(entry => <Group>entry.resource)
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

  /**
   * Creates a default "meta" object that can be assigned to new resources.
   * Currently defaults the security tags to include "everyone" with both "read" and "write" access.
   * That *could* be changed to be specific to the currently logged-in user, which is why this method
   * exists on the AuthService.
   */
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
}
