import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {OperationDefinition, OperationOutcome, ParameterComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {OperationDefinitionService} from '../shared/operation-definition.service';
import {RecentItemService} from '../shared/recent-item.service';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ParameterModalComponent} from './parameter-modal/parameter-modal.component';
import {FhirService} from '../shared/fhir.service';
import {FileService} from '../shared/file.service';
import {ConfigService} from '../shared/config.service';
import {AuthService} from '../shared/auth.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {BaseComponent} from '../base.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {IConformance} from '@trifolia-fhir/models';


@Component({
  templateUrl: './operation-definition.component.html',
  styleUrls: ['./operation-definition.component.css']
})
export class OperationDefinitionComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  public conformance;
  public operationDefinitionId: string;
  public operationDefinition;
  public message: string;
  public validation: any;
  public odNotFound = false;
  public Globals = Globals;

  public idChangedEvent = new Subject();
  public isIdUnique = true;
  public alreadyInUseIDMessage = '';

  private navSubscription: any;

  constructor(
    public route: ActivatedRoute,
    public configService: ConfigService,
    protected authService: AuthService,
    private modal: NgbModal,
    private router: Router,
    private opDefService: OperationDefinitionService,
    private recentItemService: RecentItemService,
    private fileService: FileService,
    private fhirService: FhirService) {

    super(configService, authService);

    this.operationDefinition = new OperationDefinition({ meta: this.authService.getDefaultMeta() });

    this.conformance =  { resource: this.operationDefinition, fhirVersion: <'stu3' | 'r4' | 'r5'>configService.fhirVersion, permissions: this.authService.getDefaultPermissions() };

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.fhirService.checkUniqueId(this.operationDefinition);
        if(!isIdUnique){
          this.isIdUnique = false;
          this.alreadyInUseIDMessage = "ID " +  this.operationDefinition.id  + " is already used in this IG.";
        }
        else{
          this.isIdUnique = true;
          this.alreadyInUseIDMessage="";
        }
      });
    }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('id') === 'from-file';
  }

  public urlChanged() {
    const lastIndex = this.operationDefinition.url.lastIndexOf('/');

    if (lastIndex > 0 && this.isNew) {
      this.operationDefinition.id = this.operationDefinition.url.substring(lastIndex + 1);
    }
  }

  public editParameter(parameter: ParameterComponent) {
    const modalInstance = this.modal.open(ParameterModalComponent, {size: 'lg', backdrop: 'static'});
    modalInstance.componentInstance.operationDefinition = this.operationDefinition;
    modalInstance.componentInstance.parameter = parameter;
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the operation definition?')) {
      return;
    }

    this.getOperationDefinition();
  }

  public save() {
    if (!this.validation.valid && !confirm('This operation definition is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      return;
    }

    this.opDefService.save(this.operationDefinitionId, this.conformance)
      .subscribe({
        next: (conf: IConformance) => {
          if (this.isNew) {
            // noinspection JSIgnoredPromiseFromCall
            this.operationDefinitionId = conf.id;
            this.router.navigate([`${this.configService.baseSessionUrl}/operation-definition/${conf.id}`]);
          } else {
            this.conformance = conf;
            this.operationDefinition = conf.resource;
            this.recentItemService.ensureRecentItem(Globals.cookieKeys.recentCodeSystems, conf.id, conf.name);
            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
          this.message = 'Your changes have been saved!';
        },
        error: (err) => {
          this.message = 'An error occurred while saving the operation definition:' + getErrorString(err);
        }
      });
  }

  private getOperationDefinition() {
    this.operationDefinitionId = this.isNew ? null : this.route.snapshot.paramMap.get('id');

    if (this.isFile) {
      if (this.fileService.file) {
        this.operationDefinition = <OperationDefinition>this.fileService.file.resource;
        this.nameChanged();
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      this.operationDefinition = null;

      this.opDefService.get(this.operationDefinitionId)
        .subscribe((conf: IConformance) => {
          if (!conf || !conf.resource || conf.resource.resourceType !== 'OperationDefinition') {
            this.message = 'The specified operation Definition either does not exist or was deleted';
            return;
          }
          this.conformance = conf;
          this.operationDefinition = <OperationDefinition>conf.resource;
          this.nameChanged();
          this.recentItemService.ensureRecentItem(
            Globals.cookieKeys.recentOperationDefinitions,
            this.operationDefinition.id,
            this.operationDefinition.name);
        }, (err) => {
          this.odNotFound = err.status === 404;
          this.message = getErrorString(err);
          this.recentItemService.removeRecentItem(Globals.cookieKeys.recentOperationDefinitions, this.operationDefinitionId);
        });
    }
  }

  nameChanged() {
    this.configService.setTitle(`OperationDefinition - ${this.operationDefinition.name || 'no-name'}`);
  }

  ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/operation-definition/')) {
        this.getOperationDefinition();
      }
    });
    this.getOperationDefinition();
  }

  ngOnDestroy() {
    this.navSubscription.unsubscribe();
    this.configService.setTitle(null);
  }

  ngDoCheck() {
    if (this.operationDefinition) {
      this.validation = this.fhirService.validate(this.operationDefinition);
    }
  }
}
