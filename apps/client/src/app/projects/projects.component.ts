import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base.component';
import {ConfigService} from '../shared/config.service';
import {AuthService} from '../shared/auth.service';
import {debounceTime} from 'rxjs/operators';
import {ProjectService} from '../shared/projects.service';
import {Subject} from 'rxjs';
import {IProject} from '@trifolia-fhir/models';
import {getErrorString, Globals, IImplementationGuide} from '@trifolia-fhir/tof-lib';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'trifolia-fhir-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent extends BaseComponent implements OnInit {

  public projects;
  public criteriaChangedEvent = new Subject<void>();
  public page = 1;
  public total = 0;
  public name: string;
  public author: string;
  public id: string;
  public message: string;
  public Globals = Globals;
  public recentProjects: RecentProject[] = [];

  constructor(public configService: ConfigService,
              protected authService: AuthService,
              private projectService: ProjectService,
              public cookieService: CookieService) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getProjects();
      });
  }

  public get searchProjectResults(): IProject[] {
    if (this.projects) {
      return (this.projects.results || []).map((entry) => <IProject>entry);
    }
    return [];
  }

  public clearFilters() {
    this.name = null;
    this.author = null;
    this.id = null;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public async getProjects() {
    this.configService.setStatusMessage('Loading projects');
    await this.projectService.getProjects(this.page, this.name, this.author, this.id).toPromise().then((results) => {
      this.projects = results;
      this.total = this.projects.total;
      this.configService.setStatusMessage('');
    }).catch((err) => this.message = getErrorString(err));
  }

  public projectReselected(recentProject: RecentProject) {
    const currentIndex = this.recentProjects.indexOf(recentProject);
    this.recentProjects.splice(currentIndex, 1);
    this.recentProjects.splice(0, 0, recentProject);
    this.cookieService.set(this.selectCookie, JSON.stringify(this.recentProjects));
  }

  public get selectCookie() {
    return 'projectsSelected';
  }

  public deleteProject(prToDelete) {
    this.projectService.deleteProject(prToDelete.id).toPromise().then((results) => {
      // find project in recent projects and remove it
      const currentProjectsIndex = this.searchProjectResults.findIndex(pr => pr.id === prToDelete.id);
      this.projects.results.splice(currentProjectsIndex, 1);
      const currentRecentIndex = this.recentProjects.findIndex(pr => pr.id === prToDelete.id);
      this.recentProjects.splice(currentRecentIndex, 1);

      this.total = this.total--;

    }).catch((err) => this.message = getErrorString(err));
  }

  public projectSelected(project: IProject) {
    const foundRecent = this.recentProjects.find(pr => pr.id === project.id);

    if (!foundRecent) {
      this.recentProjects.splice(0, 0, {
        id: project.id,
        name: project.name
      });
    } else if (this.recentProjects.indexOf(foundRecent) !== 0) {
      const currentIndex = this.recentProjects.indexOf(foundRecent);
      this.recentProjects.splice(currentIndex, 1);
      this.recentProjects.splice(0, 0, foundRecent);
    }

    if (this.recentProjects.length > 3) {
      this.recentProjects = this.recentProjects.slice(0, 3);
    }

    this.cookieService.set(this.selectCookie, JSON.stringify(this.recentProjects));
  }

  public nameChanged(value: string) {
    this.name = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public authorChanged(value: string) {
    this.author = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }


  async ngOnInit() {
    await this.getProjects();
    if (!!this.cookieService.get(this.selectCookie)) {
      this.recentProjects = JSON.parse(this.cookieService.get(this.selectCookie));
    }
  }

}

export class RecentProject {
  public name: string;
  public id: string;
}
