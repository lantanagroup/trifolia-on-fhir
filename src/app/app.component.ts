import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';
import {PersonListModel} from './models/person-list-model';
import {ConfigService} from './services/config.service';
import {RecentItemService} from './services/recent-item.service';
import {Globals} from './globals';
import {FileService} from './services/file.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileOpenModalComponent} from './file-open-modal/file-open-modal.component';
import {FileModel} from './models/file-model';
import {FhirService} from './services/fhir.service';
import {SocketService} from './services/socket.service';
import {SettingsModalComponent} from './settings-modal/settings-modal.component';
import {GithubService} from './services/github.service';
import {CookieService} from 'angular2-cookie/core';
import {AdminMessageModalComponent} from './admin-message-modal/admin-message-modal.component';
import * as _ from 'underscore';
import * as introJs from 'intro.js';

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
        const intro = introJs();
        intro.setOption('overlayOpacity', 0);
        intro.start();
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