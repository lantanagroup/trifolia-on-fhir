import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base.component';
import {ConfigService} from '../shared/config.service';
import {AuthService} from '../shared/auth.service';
import {debounceTime} from 'rxjs/operators';
import {ProjectService} from '../shared/projects.service';
import {Subject} from 'rxjs';
import {IProject} from '@trifolia-fhir/models';
import {getErrorString, Globals} from '@trifolia-fhir/tof-lib';

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
  public id: string;
  public message: string;
  public Globals = Globals;

  constructor(public configService: ConfigService,
              protected authService: AuthService,
              private projectService: ProjectService) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getProjects();
      });
  }

  public get searchProjectResults(): IProject[] {
    if (this.projects) {
      return (this.projects.results || []).map((entry) => <IProject> entry);
    }
    return [];
  }

  public clearFilters() {
    this.name = null;
    this.id = null;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  private async getProjects() {
     this.configService.setStatusMessage('Loading projects');
     await this.projectService.getProjects(this.page, this.name, this.id).toPromise().then((results) => {
       this.projects = results;
       this.total = this.projects.total;
       this.configService.setStatusMessage('');
       console.log(results[0]);
    }).catch((err) => this.message = getErrorString(err));
  }


  public nameChanged(value: string) {
    this.name = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  async ngOnInit() {
    await this.getProjects();
  }

}
