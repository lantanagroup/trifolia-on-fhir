import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../base.component';
import {getErrorString} from '@trifolia-fhir/tof-lib';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigService} from '../shared/config.service';
import {AuthService} from '../shared/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IProject} from '@trifolia-fhir/models';
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
    private modalService: NgbModal,
    private projectService: ProjectService,
    private router: Router){

    super(configService, authService);

  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the code system?')) {
      return;
    }

    this.getProject();
  }

  public save() {

    this.projectService.save(this.project)
      .subscribe((pr: IProject) => {
        this.message = 'Your changes have been saved!';
      }, (err) => {
        this.message = 'An error occurred while saving the code system: ' + getErrorString(err);
      });
  }

  private getProjectID(){
    return this.route.snapshot.paramMap.get('id');
  }

  private getProject() {
    const projectId = this.getProjectID();

    if (!this.isNew) {

      this.projectService.getProject(projectId)
        .subscribe((project) => {
          this.project = <IProject>project;
        }, (err) => {
          this.message = getErrorString(err);
        });
    }
  }


  ngOnInit() {
    this.getProject();
  }

  ngDoCheck() {

  }

}
