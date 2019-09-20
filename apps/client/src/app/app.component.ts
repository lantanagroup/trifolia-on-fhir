import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';
import {AuthService} from './shared/auth.service';
import {ConfigService} from './shared/config.service';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
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
import introJs from 'intro.js/intro.js';
import {Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {getHumanNamesDisplay} from '../../../../libs/tof-lib/src/lib/helper';
import {FhirReferenceModalComponent, ResourceSelection} from './fhir-edit/reference-modal/reference-modal.component';
import {Bundle, ImplementationGuide} from '../../../../libs/tof-lib/src/lib/r4/fhir';

@Component({
  selector: 'trifolia-fhir-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public person: Practitioner;

  @ViewChild('navbarToggler', {read: ElementRef, static: true}) navbarToggler: ElementRef;
  @ViewChild('navbarCollapse', {read: ElementRef, static: true}) navbarCollapse: ElementRef;

  constructor(
    public authService: AuthService,
    public githubService: GithubService,
    public configService: ConfigService,
    public fhirService: FhirService,
    private modalService: NgbModal,
    private fileService: FileService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private socketService: SocketService) {

  }

  public startIntro() {
    const intro = introJs.introJs();
    intro.setOption('overlayOpacity', 0);

    intro.onexit(() => {
      this.configService.showingIntroduction = false;
    });

    this.configService.showingIntroduction = true;

    // Give angular a few milliseconds to update the screen since "showIntroduction" may
    // have altered the UI to include additional data-intro attributes.
    setTimeout(() => {
      intro.start();
    }, 200);
  }

  public openProject() {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg' });
    modalRef.componentInstance.resourceType = 'ImplementationGuide';
    modalRef.componentInstance.hideResourceType = true;
    modalRef.componentInstance.modalTitle = 'Select an implementation guide';

    modalRef.result.then((selected: ResourceSelection) => {
      this.configService.project = {
        implementationGuideId: selected.id,
        name: selected.display
      };
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate([`${this.configService.fhirServer}/${selected.id}/home`]);
    });
  }

  public closeProject() {
    this.configService.project = null;
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate([`${this.configService.fhirServer}/home`]);
  }

  public get fhirServerDisplay(): string {
    if (this.configService.fhirServer) {
      const fhirServers = this.configService.config ?
        this.configService.config.fhirServers : [];

      const found = fhirServers.find((fhirServer) => fhirServer.id === this.configService.fhirServer);

      if (found) {
        return found.short || found.name;
      }
    }
  }

  public get displayName(): string {
    if (this.authService.practitioner) {
      return getHumanNamesDisplay(this.authService.practitioner.name);
    }

    if (this.authService.userProfile) {
      return this.authService.userProfile.name;
    }
  }

  public openFile() {
    const modalRef = this.modalService.open(FileOpenModalComponent);

    modalRef.result.then((results: FileModel) => {
      this.fileService.loadFile(results);
    });
  }

  public editSettings() {
    this.modalService.open(SettingsModalComponent, {size: 'lg'});
  }

  public supportButtonClicked() {
    const confirmedCookie = this.cookieService.get(Globals.cookieKeys.atlassianAccountConfirmed);

    if (confirmedCookie || confirm(Globals.tooltips['support.button.clicked'])) {
      this.cookieService.put(Globals.cookieKeys.atlassianAccountConfirmed, 'true');
      window.open(this.configService.config.supportUrl, 'tof-support');
    }
  }

  ngOnInit() {
    if (window.location.pathname === '/' && this.configService.fhirServer) {
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate([`/${this.configService.fhirServer}/home`]);
    }

    // Make sure the navbar is collapsed after the user clicks on a nav link to change the route
    // This needs to be done in the init method so that the navbarCollapse element exists
    this.router.events.subscribe((event) => {
      this.navbarCollapse.nativeElement.className = 'navbar-collapse collapse';

      if (event instanceof RoutesRecognized && event.state.root.firstChild) {
        const fhirServer = event.state.root.firstChild.params.fhirServer;
        const implementationGuideId = event.state.root.firstChild.params.implementationGuideId;

        if (fhirServer) {
          // noinspection JSIgnoredPromiseFromCall
          this.configService.changeFhirServer(fhirServer);

          if (implementationGuideId && (!this.configService.project || this.configService.project.implementationGuideId !== implementationGuideId)) {
            this.fhirService.search('ImplementationGuide', null, true, null, implementationGuideId).toPromise()
              .then((bundle: Bundle) => {
                if (bundle && bundle.total === 1) {
                  const ig = <ImplementationGuide>bundle.entry[0].resource;
                  this.configService.project = {
                    implementationGuideId: implementationGuideId,
                    name: ig.title || ig.name
                  };
                }
              })
              .catch(() => {
                // TODO: handle this error
              });
          } else if (!implementationGuideId) {
            this.configService.project = null;
          }
        }
      }
    });

    this.socketService.onMessage.subscribe((message) => {
      const modalRef = this.modalService.open(AdminMessageModalComponent, {backdrop: 'static'});
      modalRef.componentInstance.message = message;
    });
  }
}
