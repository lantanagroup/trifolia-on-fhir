import {Component, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../services/capability-statement.service';
import {Bundle, CapabilityStatement} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {ConfigService} from '../services/config.service';
import {Subject} from 'rxjs';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'app-capability-statements',
    templateUrl: './capability-statements.component.html',
    styleUrls: ['./capability-statements.component.css']
})
export class CapabilityStatementsComponent implements OnInit {
    public capabilityStatementsBundle: Bundle;
    public nameText: string;
    public criteriaChangedEvent = new Subject();
    public page = 1;

    constructor(
        private configService: ConfigService,
        private csService: CapabilityStatementService,
        private modalService: NgbModal) {

        this.criteriaChangedEvent
            .debounceTime(500)
            .subscribe(() => {
                this.getCapabilityStatements();
            });
    }

    public get capabilityStatements(): CapabilityStatement[] {
        if (!this.capabilityStatementsBundle) {
            return [];
        }

        return _.map(this.capabilityStatementsBundle.entry, (entry) => <CapabilityStatement> entry.resource);
    }

    public remove(capabilityStatement: CapabilityStatement) {
        if (!confirm(`Are you sure you want to delete the capability statement ${capabilityStatement.title || capabilityStatement.name || capabilityStatement.id}`)) {
            return;
        }

        this.csService.delete(capabilityStatement.id)
            .subscribe(() => {
                const index = this.capabilityStatements.indexOf(capabilityStatement);
                this.capabilityStatements.splice(index, 1);
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
        this.csService.search(this.nameText)
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
