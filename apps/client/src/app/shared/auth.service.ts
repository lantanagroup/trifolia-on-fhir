import {EventEmitter, Injectable, Injector} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Meta} from '@trifolia-fhir/stu3';
import {ConfigService} from './config.service';
import {SocketService} from './socket.service';
import {addPermission} from '@trifolia-fhir/tof-lib';
import {GroupService} from './group.service';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import type {ITofUser} from '@trifolia-fhir/tof-lib';
import { UserService } from './user.service';
import {AuditAction, type IAudit, type IGroup, type IPermission, type IProject, type IUser} from '@trifolia-fhir/models';
import { firstValueFrom } from 'rxjs';
import { AuditService } from './audit.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthService {
  public userProfile: ITofUser;
  public user: IUser;
  public authResponseReceived: boolean = false;
  public serverError: boolean = false;
  public groups: IGroup[] = [];
  public authChanged: EventEmitter<any>;
  public loggingIn = false;

  constructor(
    private injector: Injector,
    private socketService: SocketService,
    private configService: ConfigService,
    private userService: UserService,
    private groupService: GroupService,
    private oauthService: OAuthService,
    private auditService: AuditService) {

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
    let logoutUrl = this.configService.config.auth.logoutUrl;

    if (logoutUrl) {
      if (logoutUrl.indexOf('?') < 0) {
        logoutUrl += '?';
      }

      if (!logoutUrl.endsWith('?')) {
        logoutUrl += '&';
      }

      logoutUrl += 'returnTo=' + encodeURIComponent(window.location.origin + '/logout') +
        '&client_id=' + encodeURIComponent(this.configService.config.auth.clientId);
    }

    const authConfig: AuthConfig = {};
    authConfig.issuer = this.configService.config.auth.issuer;
    authConfig.clientId = this.configService.config.auth.clientId;
    authConfig.redirectUri = window.location.origin + '/login';
    authConfig.postLogoutRedirectUri = window.location.origin + '/logout';
    authConfig.logoutUrl = logoutUrl;
    authConfig.silentRefreshRedirectUri = window.location.origin + '/silent-refresh.html';
    authConfig.scope = this.configService.config.auth.scope;
    authConfig.requireHttps = false;
    authConfig.requestAccessToken = true;
    //authConfig.showDebugInformation = true;

    this.oauthService.configure(authConfig);


    // For debugging:
    //this.oauthService.events.subscribe(e => e instanceof OAuthErrorEvent ? console.error(e) : console.warn(e));

    this.oauthService.loadDiscoveryDocumentAndTryLogin({
      onTokenReceived: () => {
        
        const newAudit: IAudit = {
          action: AuditAction.Login,
          timestamp: new Date(),
          note: `Issuer: ${this.oauthService.issuer}, Client ID: ${this.oauthService.clientId}, Scope: ${this.oauthService.scope}`
        }
        this.auditService.save(newAudit).subscribe();

        this.router.navigateByUrl(decodeURIComponent(this.oauthService.state));
      }
    })
      .then(() => {
        // Set the user session and context
        this.handleAuthentication();
      });

    this.oauthService.setupAutomaticSilentRefresh();

    this.authChanged.subscribe(() => {
      if (this.isAuthenticated()) {
        this.socketService.notifyAuthenticated(this.userProfile, this.user);
      }
    });

    // If the socket re-connects, then re-send the authentication information for the connection
    this.socketService.onConnected.subscribe(() => {
      if (this.isAuthenticated()) {
        this.socketService.notifyAuthenticated(this.userProfile, this.user);
      }
    });

    // When the FHIR server changes, get the profile for the user on the FHIR server
    // and then notify the socket connection that the user has been authenticated
   // this.configService.fhirServerChanged.subscribe(async () => {
     this.getProfile();

      if (this.isAuthenticated()) {
        this.socketService.notifyAuthenticated(this.userProfile, this.user);
      }
   // });
  }

  public login(): void {
    if (!this.oauthService) {
      return;
    }
    this.oauthService.initImplicitFlow();
  }

  public async handleAuthentication(): Promise<void> {
    if (!this.oauthService) {
      return;
    }

    if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {

      this.authChanged.emit();
      await this.getProfile();
      this.socketService.notifyAuthenticated({
        userProfile: this.userProfile,
        user: this.user
      });

      window.location.hash = '';
      let path;
      if (!this.oauthService.state || this.oauthService.state !== 'undefined'){
        path = this.oauthService.state;
      } else{
        path = this.activatedRoute.snapshot.queryParams.pathname || `/${this.configService.baseSessionUrl}/implementation-guide/open`;
      }

      // Make sure the user is not sent back to the /login page, which is only used to active .handleAuthentication()
      if (path.startsWith('/login')) {
        //path = '/';
        path = this.activatedRoute.snapshot.queryParams.pathname || `/projects`;
      }

      let navigateTo: string;

      if (path && path !== '/' && path !== '/logout' && path !== '/login' && !path.endsWith('/home')) {
        navigateTo = path;
      } else if (window.location.pathname === '/' || window.location.pathname === '/login' || path.endsWith('/home')) {
        navigateTo = '/projects';
      }

      if (navigateTo) {
        await new Promise(f => setTimeout(f, 500));
        this.router.navigate([navigateTo]);
      }

    }
  }

  public logout(): void {
    if (this.oauthService) {
      this.oauthService.logOut();
    }

    // Go back to the home route
    // noinspection JSIgnoredPromiseFromCall

    this.router.navigate([`/${this.configService.baseSessionUrl}/home`]);
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

      // userProfile.isAdmin = true;
      return userProfile;
    }
  }

  public async getProfile(): Promise<{ userProfile: any, user: IUser, serverError: boolean }> {
    this.authResponseReceived = false;
    this.serverError = false;
    if (!this.isAuthenticated()) {
      return Promise.resolve({ userProfile: null, user: null, serverError: false });
    }

    this.userProfile = this.getAuthUserInfo();
    this.groups = [];

    try {
      this.user = await firstValueFrom(this.userService.getMe());
      this.groups = await firstValueFrom(this.groupService.getMembership());
    } catch (ex) {
      console.error(ex);
      if (ex instanceof HttpErrorResponse && ex.status === 500) {
        this.serverError = true;
      }      
      this.user = null;
    }

    this.authResponseReceived = true;

    // This also triggers a notification to the socket
    this.authChanged.emit();

    return {
      userProfile: this.userProfile,
      user: this.user,
      serverError: this.serverError
    };
  }

  /**
   * Creates a default "meta" object that can be assigned to new resources.
   * This previously contained creating default security tags, but that is no longer needed with permissions moving to the project level.
   * This is kept here for any potential future use.
   */
  public getDefaultMeta(): Meta {
    return new Meta();
  }


  public getDefaultPermissions(): IPermission[] {
    let conf: IProject = <IProject>{};
    addPermission(conf, 'everyone', 'write');
    return conf.permissions;
  }
}
