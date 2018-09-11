import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as auth0 from 'auth0-js';
import {PersonService} from './person.service';
import {Person} from '../models/stu3/fhir';

@Injectable()
export class AuthService {
    private readonly clientID = 'mpXWwpAOBTt5aUM1SE2q5KuUtr4YvUE9';
    private readonly domain = 'trifolia.auth0.com';
    private readonly audience = 'https://trifolia.lantanagroup.com/api';
    private readonly scope = 'openid profile name nickname email';

    // expiresIn is in seconds
    private readonly fiveMinutesInSeconds = 300;

    public auth0 = new auth0.WebAuth({
        clientID: this.clientID,
        domain: this.domain,
        responseType: 'token id_token',
        audience: this.audience,
        redirectUri: location.origin + '/login?pathname=' + encodeURIComponent(location.pathname),
        scope: this.scope
    });
    public userProfile: any;
    public person: Person;
    public authExpiresAt: number;
    public authChanged: EventEmitter<any>;
    private authTimeout: any;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private personService: PersonService) {
        this.authExpiresAt = JSON.parse(localStorage.getItem('expires_at'));
        this.authChanged = new EventEmitter();

        if (this.authExpiresAt) {
            this.setSessionTimer();
        }
    }

    public login(): void {
        this.auth0.authorize();
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            const path = this.activatedRoute.snapshot.queryParams.pathname || '/home';
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.setSession(authResult);
                this.getProfile(() => {
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

    public getProfile(cb): void {
        const accessToken = localStorage.getItem('token');

        if (!accessToken) {
            throw new Error('Access token must exist to fetch profile');
        }

        const self = this;
        this.auth0.client.userInfo(accessToken, (userInfoErr, userProfile) => {
            if (userInfoErr) {
                return cb(userInfoErr);
            }

            if (userProfile) {
                self.userProfile = userProfile;

                this.personService.getMe()
                    .subscribe((person) => {
                        self.person = person;

                        cb(null, userProfile, person);
                        self.authChanged.emit();
                    }, (personErr) => {
                        cb(personErr);
                    });
            }
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
                    audience: this.audience,
                    scope: this.scope
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
