import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as auth0 from 'auth0-js';
import {PractitionerService} from './practitioner.service';
import {Practitioner} from '../models/stu3/fhir';
import {ConfigService} from './config.service';
import {SocketService} from './socket.service';
import {NewUserModalComponent} from '../new-user-modal/new-user-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class AuthService {
    // expiresIn is in seconds
    private readonly fiveMinutesInSeconds = 300;

    public auth0: any;
    public userProfile: any;
    public practitioner: Practitioner;
    public authExpiresAt: number;
    public authChanged: EventEmitter<any>;
    private authTimeout: any;

    constructor(
        public router: Router,
        private socketService: SocketService,
        private configService: ConfigService,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private practitionerService: PractitionerService) {
        this.authExpiresAt = JSON.parse(localStorage.getItem('expires_at'));
        this.authChanged = new EventEmitter();

        if (this.authExpiresAt) {
            this.setSessionTimer();
        }

        this.auth0 = new auth0.WebAuth({
            clientID: this.configService.config.auth.clientId,
            domain: this.configService.config.auth.domain,
            responseType: 'token',
            redirectUri: location.origin + '/login?pathname=' + encodeURIComponent(location.pathname),
            scope: this.configService.config.auth.scope
        });

        this.configService.fhirServerChanged.subscribe((fhirServer) => {
            // This should only be triggered after the app has been initialized. So, this should truly be when the fhir server
            // changes during the user's session.
            if (this.isAuthenticated()) {
                // After the fhir server has been initialized, make sure the user has a profile on the FHIR server
                this.getProfile()
                    .then(() => {
                        this.socketService.notifyAuthenticated(this.userProfile, this.practitioner);
                    })
                    .catch((err) => {
                        if (err && err.status === 404) {
                            const modalRef = this.modalService.open(NewUserModalComponent, {size: 'lg'});
                            modalRef.result.then((practitioner: Practitioner) => {
                                this.practitioner = practitioner;
                                this.socketService.notifyAuthenticated(this.userProfile, this.practitioner);
                                this.authChanged.emit();
                            });
                        }
                    });
            }
        });

        // If the socket re-connects, then re-send the authentication information for the connection
        this.socketService.onConnected.subscribe(() => {
            if (this.isAuthenticated()) {
                this.socketService.notifyAuthenticated(this.userProfile, this.practitioner);
            }
        })
    }

    public login(): void {
        this.auth0.authorize();
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            const path = this.activatedRoute.snapshot.queryParams.pathname || '/home';
            if (authResult && authResult.idToken) {
                window.location.hash = '';
                this.setSession(authResult);
                this.getProfile()
                    .then(() => {
                        this.router.navigate([path]);
                        this.authChanged.emit();
                        this.socketService.notifyAuthenticated({
                            userProfile: this.userProfile,
                            practitioner: this.practitioner
                        });
                    });
            } else if (err) {
                this.router.navigate(['/home']);
                console.log(err);
            }
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

        // Go back to the home route
        this.router.navigate(['/']);
        this.authChanged.emit();
    }

    public isAuthenticated(): boolean {
        return new Date().getTime() < this.authExpiresAt;
    }

    public getProfile(): Promise<{ userProfile: any, practitioner: Practitioner }> {
        const accessToken = localStorage.getItem('token');
        const self = this;

        if (!accessToken) {
            throw new Error('Access token must exist to fetch profile');
        }

        return new Promise((resolve, reject) => {
            this.auth0.client.userInfo(accessToken, (userInfoErr, userProfile) => {
                if (userInfoErr) {
                    return reject(userInfoErr);
                }

                if (userProfile) {
                    self.userProfile = userProfile;

                    this.practitionerService.getMe()
                        .subscribe((practitioner: Practitioner) => {
                            self.practitioner = practitioner;

                            resolve({
                                userProfile: userProfile,
                                practitioner: practitioner
                            });
                            self.authChanged.emit();
                        }, (err) => {
                            reject(err);
                        });
                }
            });
        });
    }

    private setSessionTimer() {
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
