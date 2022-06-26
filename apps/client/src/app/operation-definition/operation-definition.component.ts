import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {OperationDefinition, OperationOutcome, ParameterComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {OperationDefinitionService} from '../shared/operation-definition.service';
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

@Component({
  templateUrl: './operation-definition.component.html',
  styleUrls: ['./operation-definition.component.css']
})
export class OperationDefinitionComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  public operationDefinition: OperationDefinition;
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
    private fileService: FileService,
    private fhirService: FhirService) {

    super(configService, authService);

    this.operationDefinition = new OperationDefinition({ meta: this.authService.getDefaultMeta() });

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.fhirService.checkUniqueId(this.operationDefinition);
        if(!isIdUnique){
          this.isIdUnique = false;
          this.alreadyInUseIDMessage = "ID " +  this.operationDefinition.id  + " is already used.";
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

    this.opDefService.save(this.operationDefinition)
      .subscribe((results: OperationDefinition) => {
        if (this.isNew) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.baseSessionUrl}/operation-definition/${results.id}`]);
        } else {
          this.message = 'Your changes have been saved!';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      }, (err) => {
        this.message = `An error occurred while saving the operation definition: ${err.message}`;
      });
  }

  private getOperationDefinition() {
    const operationDefinitionId = this.route.snapshot.paramMap.get('id');

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

      this.opDefService.get(operationDefinitionId)
        .subscribe((opDef: OperationDefinition | OperationOutcome) => {
          if (opDef.resourceType !== 'OperationDefinition') {
            this.message = 'The specified operation definition either does not exist or was deleted';
            return;
          }

          this.operationDefinition = <OperationDefinition>opDef;
          this.nameChanged();
        }, (err) => {
          this.odNotFound = err.status === 404;
          this.message = getErrorString(err);
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
