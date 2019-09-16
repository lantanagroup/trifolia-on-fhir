import {Component, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../shared/capability-statement.service';
import {Bundle, CapabilityStatement} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';

@Component({
  templateUrl: './capability-statements.component.html',
  styleUrls: ['./capability-statements.component.css']
})
export class CapabilityStatementsComponent extends BaseComponent implements OnInit {
  public capabilityStatementsBundle: Bundle;
  public nameText: string;
  public criteriaChangedEvent = new Subject();
  public page = 1;
  public Globals = Globals;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private csService: CapabilityStatementService,
    private modalService: NgbModal) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getCapabilityStatements();
      });
  }

  public get capabilityStatements(): CapabilityStatement[] {
    if (!this.capabilityStatementsBundle || !this.capabilityStatementsBundle.entry) {
      return [];
    }

    return this.capabilityStatementsBundle.entry.map((entry) => <CapabilityStatement>entry.resource);
  }

  public remove(capabilityStatement: CapabilityStatement) {
    if (!confirm(`Are you sure you want to delete the capability statement ${capabilityStatement.title || capabilityStatement.name || capabilityStatement.id}`)) {
      return;
    }

    this.csService.delete(capabilityStatement.id)
      .subscribe(() => {
        const entry = (this.capabilityStatementsBundle.entry || []).find((entry) => entry.resource.id === capabilityStatement.id);
        const index = this.capabilityStatementsBundle.entry.indexOf(entry);
        this.capabilityStatementsBundle.entry.splice(index, 1);
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
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
    modalRef.componentInstance.resourceType = capabilityStatement.resourceType;
    modalRef.componentInstance.originalId = capabilityStatement.id;
    modalRef.result.then((newId) => {
      capabilityStatement.id = newId;
    });
  }

  public getCapabilityStatements() {
    this.capabilityStatementsBundle = null;

    const implementationGuideId = this.configService.project ?
      this.configService.project.implementationGuideId :
      null;

    this.csService.search(this.page, this.nameText, implementationGuideId)
      .subscribe((results) => {
        this.capabilityStatementsBundle = results;
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
