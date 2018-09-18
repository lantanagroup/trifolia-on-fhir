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
import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public userProfile: any;
    public person: PersonListModel;

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
        this.configService.fhirServerChanged.subscribe((fhirServer) => {
            // This should only be triggered after the app has been initialized. So, this should truly be when the fhir server
            // changes during the user's session.
            if (this.authService.isAuthenticated()) {
                const self = this;

                // After the fhir server has been initialized, make sure the user has a profile on the FHIR server
                this.authService.getProfile()
                    .catch((err) => {
                        if (err && err.status === 404) {
                            const modalRef = this.modalService.open(NewUserModalComponent);
                        }
                    });

                // When the fhir server changes, re-direct the user home so that data shown on the screen isn't from the wrong FHIR server
                this.router.navigate(['/home']);
            }
        });
    }
}
