import {Component, OnInit} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
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
        private modalService: NgbModal,
        private fileService: FileService,
        public fhirService: FhirService,
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

    public openFile() {
        const modalRef = this.modalService.open(FileOpenModalComponent);

        modalRef.result.then((results: FileModel) => {
            this.fileService.loadFile(results);
        });
    }

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            const self = this;
            this.authService.getProfile((err, profile, person) => { });
        }

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.isBigContainer =
                    event.url.startsWith('/implementation-guide/') ||
                    (event.url.startsWith('/structure-definition') && !event.url.endsWith('/new')) ||
                    event.url.startsWith('/capability-statement/');
            }
        });
    }
}
