import {Component, DoCheck, OnInit} from '@angular/core';
import {BaseComponent} from '../base.component';
import {getErrorString} from '@trifolia-fhir/tof-lib';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ConfigService} from '../shared/config.service';
import {AuthService} from '../shared/auth.service';
import {IPermission, IProject} from '@trifolia-fhir/models';
import {ProjectService} from '../shared/projects.service';

@Component({
  selector: 'trifolia-fhir-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent extends BaseComponent implements OnInit,  DoCheck {

  public project: IProject;

  public idChangedEvent = new Subject();
  public isIdUnique = true;
  public alreadyInUseIDMessage = '';
  public message: string;

  constructor(
    public route: ActivatedRoute,
    public configService: ConfigService,
    protected authService: AuthService,
    private projectService: ProjectService) {

    super(configService, authService);

  }

  public get isNew(): boolean {
    const id = this.getProjectID();
    return !id || id === 'new';
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the project?')) {
      return;
    }

    this.getProject();
  }

  public save() {

    this.projectService.save(this.project)
      .subscribe({
        next: (pr: IProject) => {
          this.message = 'Your changes have been saved!';
          this.configService.currentProject = pr;
        }, 
        error: (err) => {
          this.message = 'An error occurred while saving the project: ' + getErrorString(err);
        }
      });
  }

  private getProjectID(){
    return this.route.snapshot.paramMap.get('projectId');
  }

  private getProject() {
    const projectId = this.getProjectID();

    if (!this.isNew) {

      this.projectService.getProject(projectId).subscribe({
        next: (project: IProject) => {
          this.project = project;
          this.configService.currentProject = project;
        }, 
        error: (err) => {
          this.message = getErrorString(err);
        }
      });
    }
  }


  ngOnInit() {
    this.getProject();
  }

  ngDoCheck() {

  }

}
