import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './shared/auth.service';
import {PersonListModel} from './models/person-list-model';
import {ConfigService} from './shared/config.service';
import {RecentItemService} from './shared/recent-item.service';
import {Globals} from './globals';
import {FileService} from './shared/file.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileOpenModalComponent} from './modals/file-open-modal/file-open-modal.component';
import {FileModel} from './models/file-model';
import {FhirService} from './shared/fhir.service';
import {SocketService} from './shared/socket.service';
import {SettingsModalComponent} from './modals/settings-modal/settings-modal.component';
import {GithubService} from './shared/github.service';
import {CookieService} from 'angular2-cookie/core';
import {AdminMessageModalComponent} from './modals/admin-message-modal/admin-message-modal.component';
import * as _ from 'underscore';
import introJs from 'intro.js/intro.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public userProfile: any;
    public person: PersonListModel;

    @ViewChild('navbarToggler', { read: ElementRef }) navbarToggler: ElementRef;
    @ViewChild('navbarCollapse', { read: ElementRef }) navbarCollapse: ElementRef;

    constructor(
        public authService: AuthService,
        public githubService: GithubService,
        public configService: ConfigService,
        public recentItemService: RecentItemService,
        public fhirService: FhirService,
        private modalService: NgbModal,
        private fileService: FileService,
        private router: Router,
        private cookieService: CookieService,
        private socketService: SocketService) {
        this.authService.authChanged.subscribe(() => {
            this.userProfile = this.authService.userProfile;
            this.person = this.authService.practitioner;
        });
    }

    public startIntro() {
        const intro = introJs.introJs();
        intro.setOption('overlayOpacity', 0);

        intro.onexit(() => {
            this.configService.showingIntroduction = false;
        });

        this.configService.showingIntroduction = true;

        setTimeout(() => {
            intro.start();
        }, 200);
    }

    public get fhirServerDisplay(): string {
        if (this.configService.fhirServer) {
            const found = _.find(this.configService.config.fhirServers, (fhirServer) => fhirServer.id === this.configService.fhirServer);

            if (found) {
                return found.short || found.name;
            }
        }
    }

    public get displayName(): string {
        if (this.person) {
            return this.person.getDisplayName();
        }

        if (this.userProfile) {
            return this.userProfile.name;
        }
    }

    public openFile() {
        const modalRef = this.modalService.open(FileOpenModalComponent);

        modalRef.result.then((results: FileModel) => {
            this.fileService.loadFile(results);
        });
    }

    public editSettings() {
        this.modalService.open(SettingsModalComponent, { size: 'lg' });
    }

    public supportButtonClicked() {
        const confirmedCookie = this.cookieService.get(Globals.cookieKeys.atlassianAccountConfirmed);

        if (confirmedCookie || confirm(Globals.tooltips['support.button.clicked'])) {
            this.cookieService.put(Globals.cookieKeys.atlassianAccountConfirmed, 'true');
            window.open(this.configService.config.supportUrl, 'tof-support');
        }
    }

    ngOnInit() {
        this.router.events.subscribe(() => {
            this.navbarCollapse.nativeElement.className = 'navbar-collapse collapse';
        });

        this.socketService.onMessage.subscribe((message) => {
            const modalRef = this.modalService.open(AdminMessageModalComponent, { backdrop: 'static' });
            modalRef.componentInstance.message = message;
        });
    }
}