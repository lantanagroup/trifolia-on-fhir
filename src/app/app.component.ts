import { Component, OnInit } from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import { AuthService } from './services/auth.service';
import { PersonListModel } from './models/person-list-model';
import { ConfigService } from './services/config.service';
import {RecentItemService} from './services/recent-item.service';
import {Globals} from './globals';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ ConfigService ]
})
export class AppComponent implements OnInit {
    public userProfile: any;
    public person: PersonListModel;
    public isBigContainer = false;

    constructor(
        public authService: AuthService,
        public configService: ConfigService,
        public recentItemService: RecentItemService,
        public globals: Globals,
        private router: Router) {
        this.authService.authChanged.subscribe(() => {
            this.userProfile = this.authService.userProfile;
            this.person = this.authService.person;
        });
    }

    public getDisplayName(): string {
        if (this.person) {
            return this.person.getDisplayName();
        }

        if (this.userProfile) {
            return this.userProfile.name;
        }
    }

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            const self = this;
            this.authService.getProfile((err, profile, person) => { });
        }

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.isBigContainer =
                    event.url.startsWith('/structure-definition/');
            }
        });
    }
}
