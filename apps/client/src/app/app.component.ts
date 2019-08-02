import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {AuthService} from './shared/auth.service';
import {ConfigService} from './shared/config.service';
import {RecentItemService} from './shared/recent-item.service';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public userProfile: any;
  public person: Practitioner;

  @ViewChild('navbarToggler', {read: ElementRef}) navbarToggler: ElementRef;
  @ViewChild('navbarCollapse', {read: ElementRef}) navbarCollapse: ElementRef;

  constructor(
    public authService: AuthService,
    public githubService: GithubService,
    public configService: ConfigService,
    public recentItemService: RecentItemService,
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
    // Make sure the navbar is collapsed after the user clicks on a nav link to change the route
    // This needs to be done in the init method so that the navbarCollapse element exists
    this.router.events.subscribe((event) => {
      this.navbarCollapse.nativeElement.className = 'navbar-collapse collapse';

      if (event instanceof NavigationStart) {
        const url = (event.url || '').substring(event.url.startsWith('/') ? 1 : 0);
        const urlParts = url.split('/');

        if (!url) {
          this.router.navigate([`/${this.configService.fhirServer}/home`]);
        } else if (this.configService.config && this.configService.config.fhirServers && this.configService.config.fhirServers.find((fhirServer) => fhirServer.id === urlParts[0])) {
          this.configService.changeFhirServer(urlParts[0]);
        }
      }
    });

    this.socketService.onMessage.subscribe((message) => {
      const modalRef = this.modalService.open(AdminMessageModalComponent, {backdrop: 'static'});
      modalRef.componentInstance.message = message;
    });
  }
}
