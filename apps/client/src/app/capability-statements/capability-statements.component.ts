import {Component, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../shared/capability-statement.service';
import {CapabilityStatement} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './capability-statements.component.html',
  styleUrls: ['./capability-statements.component.css']
})
export class CapabilityStatementsComponent extends BaseComponent implements OnInit {
  public capabilityStatementsBundle;
  public nameText: string;
  public criteriaChangedEvent = new Subject<void>();
  public page = 1;
  public Globals = Globals;
  public total: string;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private csService: CapabilityStatementService,
    private modalService: NgbModal,
    public route: ActivatedRoute) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getCapabilityStatements();
      });
  }

  public get capabilityStatements(): CapabilityStatement[] {
    if (!this.capabilityStatementsBundle || !this.capabilityStatementsBundle.results ) {
      return [];
    }

    return this.capabilityStatementsBundle.results.map((entry) => <CapabilityStatement>entry);
  }

  public remove(capabilityStatement: CapabilityStatement) {
    if (!confirm(`Are you sure you want to delete the capability statement ${capabilityStatement.title || capabilityStatement.name || capabilityStatement.id}`)) {
      return;
    }

    this.csService.delete(capabilityStatement.id)
      .subscribe(() => {
        const entry = (this.capabilityStatementsBundle.results || []).find((e) => e.id === capabilityStatement.id);
        const index = this.capabilityStatementsBundle.results.indexOf(entry);
        this.capabilityStatementsBundle.results.splice(index, 1);
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while deleting the capability statement');
      });
  }

  public nameTextChanged(value: string) {
    this.nameText = value;
    this.page = 1;
    this.criteriaChanged();
  }

  public changeId(capabilityStatement: CapabilityStatement) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.resourceType = capabilityStatement.resourceType;
    modalRef.componentInstance.originalId = capabilityStatement.id;
    modalRef.result.then((newId) => {
      capabilityStatement.id = newId;
    });
  }


  public getCapabilityStatements() {
    this.capabilityStatementsBundle = null;
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    this.csService.search(this.page, this.nameText, implementationGuideId)
      .subscribe((results) => {
        this.capabilityStatementsBundle = results;
        this.total = this.capabilityStatementsBundle.total;
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while searching for capability statements');
      });
  }

  public clearFilters() {
    this.nameText = null;
    this.criteriaChanged();
  }

  public criteriaChanged() {
    this.criteriaChangedEvent.next();
  }

  ngOnInit() {
    this.getCapabilityStatements();
  }
}
