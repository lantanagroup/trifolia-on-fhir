import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as auth0 from 'auth0-js';
import {PersonService} from './person.service';
import {Person} from '../models/stu3/fhir';
import {ConfigService} from './config.service';

@Injectable()
export class AuthService {
    // expiresIn is in seconds
    private readonly fiveMinutesInSeconds = 300;

    public auth0: any;
    public userProfile: any;
    public person: Person;
    public authExpiresAt: number;
    public authChanged: EventEmitter<any>;
    private authTimeout: any;

    constructor(
        public router: Router,
        private configService: ConfigService,
        private activatedRoute: ActivatedRoute,
        private personService: PersonService) {
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
        this.person = null;
        this.authExpiresAt = null;

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

    public getProfile(): Promise<{ userProfile: any, person: Person }> {
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

                    this.personService.getMe()
                        .subscribe((person: Person) => {
                            self.person = person;

                            resolve({
                                userProfile: userProfile,
                                person: person
                            });
                            self.authChanged.emit();
                        }, (personErr) => {
                            reject(personErr);
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
