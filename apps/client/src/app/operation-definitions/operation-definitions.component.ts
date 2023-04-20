import {Component, OnInit} from '@angular/core';
import {OperationDefinitionService} from '../shared/operation-definition.service';
import {OperationDefinition, SearchParameter} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './operation-definitions.component.html',
  styleUrls: ['./operation-definitions.component.css']
})
export class OperationDefinitionsComponent extends BaseComponent implements OnInit {
  public operationDefinitionsBundle;
  public nameText: string;
  public criteriaChangedEvent = new Subject<void>();
  public page = 1;
  public Globals = Globals;
  public total: string;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private opDefService: OperationDefinitionService,
    private modalService: NgbModal,
    public route: ActivatedRoute) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getOperationDefinitions();
      });
  }

  public get operationDefinitions(): OperationDefinition[] {
    if (!this.operationDefinitionsBundle || !this.operationDefinitionsBundle.results) {
      return [];
    }

    return (this.operationDefinitionsBundle.results || []).map((entry) => <OperationDefinition>entry);
  }

  public nameTextChanged(value: string) {
    this.nameText = value;
    this.criteriaChangedEvent.next();
  }

  public remove(operationDefinition: OperationDefinition) {
    if (!confirm(`Are you sure you want to delete the operation definition ${operationDefinition.name || operationDefinition.id}`)) {
      return;
    }

    this.opDefService.delete(operationDefinition.id)
      .subscribe(() => {
        const entry = (this.operationDefinitionsBundle.results || []).find((e) => e.resource.id === operationDefinition.id);
        const index = this.operationDefinitionsBundle.results.indexOf(entry);
        this.operationDefinitionsBundle.results.splice(index, 1);
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while deleting the operation definition');
      });
  }

  public changeId(operationDefinition: OperationDefinition) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.resourceType = operationDefinition.resourceType;
    modalRef.componentInstance.originalId = operationDefinition.id;
    modalRef.result.then((newId) => {
      operationDefinition.id = newId;
    });
  }

  public getOperationDefinitions() {
    this.operationDefinitionsBundle = null;

    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    this.opDefService.search(this.page, this.nameText,  implementationGuideId )
      .subscribe((results) => {
        this.operationDefinitionsBundle = results;
        this.total = this.operationDefinitionsBundle.total;
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while searching for operation definitions');
      });
  }

  public clearFilters() {
    this.nameText = null;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  ngOnInit() {
    this.getOperationDefinitions();
  }
}
