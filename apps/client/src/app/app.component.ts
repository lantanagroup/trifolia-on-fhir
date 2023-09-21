import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import {AuthService} from './shared/auth.service';
import {ConfigService} from './shared/config.service';
import {getImplementationGuideContext, Globals, ImplementationGuideContext} from '@trifolia-fhir/tof-lib';
import {FileService} from './shared/file.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileOpenModalComponent} from './modals/file-open-modal/file-open-modal.component';
import {FileModel} from './models/file-model';
import {FhirService} from './shared/fhir.service';
import {SocketService} from './shared/socket.service';
import {SettingsModalComponent} from './modals/settings-modal/settings-modal.component';
import {GithubService} from './shared/github.service';
import {CookieService} from 'ngx-cookie-service';
import {AdminMessageModalComponent} from './modals/admin-message-modal/admin-message-modal.component';
import introJs from 'intro.js/intro.js';
import { Practitioner } from '@trifolia-fhir/stu3';
import { ImplementationGuideService } from './shared/implementation-guide.service';
import { IFhirResource, IProject } from '@trifolia-fhir/models';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from './shared/projects.service';

declare let gtag: Function;

@Component({
  selector: 'trifolia-fhir-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public person: Practitioner;
  public initialized = false;
  public statusMessage: string;

  @ViewChild('navbarToggler', { read: ElementRef, static: true }) navbarToggler: ElementRef;
  @ViewChild('navbarCollapse', { read: ElementRef, static: true }) navbarCollapse: ElementRef;

  constructor(
    public authService: AuthService,
    public githubService: GithubService,
    public configService: ConfigService,
    public fhirService: FhirService,
    public projectService: ProjectService,
    public implGuideService: ImplementationGuideService,
    private modalService: NgbModal,
    private fileService: FileService,
    private router: Router,
    private cookieService: CookieService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef) {
    this.router.events.subscribe(async (event) => {
      this.navbarCollapse.nativeElement.className = 'navbar-collapse collapse';
      if (event instanceof RoutesRecognized && event.state.root.firstChild) {
        const implementationGuideId = event.state.root.firstChild.params.implementationGuideId;
        const projectId = event.state.root.firstChild.params.projectId;

        if (implementationGuideId) {
          if (!this.configService.igContext || this.configService.igContext.implementationGuideId !== implementationGuideId) {
            this.configService.igContext = {
              implementationGuideId: implementationGuideId
            };
          }
        } else {
          this.configService.igContext = null;
        }
        this.configService.igContext = await this.getImplementationGuideContext(implementationGuideId);
        this.configService.currentProject = await this.getCurrentProject(projectId);
        this.configService.isChanged = false;
        
      } else if (event instanceof NavigationEnd) {
        if (this.configService.config.googleAnalyticsCode && event.urlAfterRedirects.indexOf('access_token=') < 0) {
          gtag('event', 'page_view', {
            'page_location': document.location.origin + event.urlAfterRedirects,
            'page_title': document.title,
            'user': this.authService.user ? `${this.authService.user.firstName} ${this.authService.user.lastName} (${this.authService.user.id})` : null
          });
        }
      }
    });

  }

  get showHome() {
    return !this.authService.isAuthenticated();
  }

  get showNewUser() {
    return this.authService.isAuthenticated() && !this.authService.user;
  }

  get showRouterOutlet() {
    return this.authService.isAuthenticated() && !!this.authService.user;
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

  public closeProject() {
    this.configService.igContext = null;
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/projects']);
  }

/*  public get fhirServerDisplay(): string {
    if (this.configService.fhirServer) {
      const fhirServers = this.configService.config ?
        this.configService.config.fhirServers : [];

      const found = fhirServers.find((fhirServer) => fhirServer.id === this.configService.fhirServer);

      if (found) {
        return found.short || found.name;
      }
    }
  }*/

  public get displayName(): string {
    if (this.authService.user) {
      return this.authService.user.name;
    }

    if (this.authService.userProfile) {
      return this.authService.userProfile.name;
    }
  }

  public openFile() {
    console.log('openFile');
    const modalRef = this.modalService.open(FileOpenModalComponent, { backdrop: 'static' });
    console.log('openFile :: modal opened', modalRef);

    modalRef.result.then((results: FileModel) => {
      console.log('modalRef.result.then results', results);
      this.fileService.loadFile(results);
    });
  }

  public editSettings() {
    this.modalService.open(SettingsModalComponent, { size: 'lg', backdrop: 'static' });
  }

  public supportButtonClicked() {
    const confirmedCookie = this.cookieService.get(Globals.cookieKeys.atlassianAccountConfirmed);

    if (confirmedCookie || confirm(Globals.tooltips['support.button.clicked'])) {
      this.cookieService.set(Globals.cookieKeys.atlassianAccountConfirmed, 'true');
      window.open(this.configService.config.supportUrl, 'tof-support');
    }
  }

  private async getCurrentProject(projectId?: string): Promise<IProject> {

    // project already set and has same id so no need to look it up
    if (projectId && this.configService.currentProject && projectId === this.configService.currentProject.id) {
      return Promise.resolve(this.configService.currentProject);
    }

    if (projectId) {
      return firstValueFrom(this.projectService.getProject(projectId));
    }

    if (this.configService.igContext && this.configService.igContext.implementationGuideId) {
      const ig = await firstValueFrom(this.implGuideService.getImplementationGuide(this.configService.igContext.implementationGuideId));
      if (ig && ig.projects && ig.projects[0]) {
        if (typeof ig.projects[0] === typeof {}) {
          return Promise.resolve(ig.projects[0]);
        }
        return firstValueFrom(this.projectService.getProject(ig.projects[0].toString()));
      }
    }
    
    return Promise.resolve(this.configService.currentProject);
  }

  private async getImplementationGuideContext(implementationGuideId?: string): Promise<ImplementationGuideContext> {
    if (!implementationGuideId) {
      return Promise.resolve(this.configService.igContext);
    }

    if (this.configService.igContext && this.configService.igContext.implementationGuideId === implementationGuideId && this.configService.igContext.name) {
      return Promise.resolve(this.configService.igContext);
    }

    return new Promise((resolve, reject) => {
      firstValueFrom(this.implGuideService.getImplementationGuide(implementationGuideId))
        .then((conf: IFhirResource) => {
          resolve(getImplementationGuideContext(conf));
        })
        .catch((err) => reject(err));
    });
  }

  async ngOnInit() {
    
    this.socketService.onMessage.subscribe((message) => {
      const modalRef = this.modalService.open(AdminMessageModalComponent, { backdrop: 'static' });
      modalRef.componentInstance.message = message;
    });

    this.configService.statusMessage.subscribe((s: string) => {
      this.statusMessage = s;
      this.cdr.detectChanges();
    });

    if (window.location.pathname === '/') {
      await this.router.navigate([`/projects/home`]);
    }
  }
}
