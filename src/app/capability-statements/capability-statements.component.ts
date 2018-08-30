import {Component, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../services/capability-statement.service';
import {CapabilityStatement} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';

@Component({
    selector: 'app-capability-statements',
    templateUrl: './capability-statements.component.html',
    styleUrls: ['./capability-statements.component.css']
})
export class CapabilityStatementsComponent implements OnInit {
    public capabilityStatements: CapabilityStatement[] = [];
    public contentText: string;

    constructor(
        private csService: CapabilityStatementService,
        private modalService: NgbModal) {
    }

    public remove(capabilityStatement: CapabilityStatement) {

    }

    public contentTextChanged(value: string) {

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
        this.csService.search()
            .subscribe((results) => {
                this.capabilityStatements = _.map(results.entry, (entry) => <CapabilityStatement> entry.resource);
            });
    }

    ngOnInit() {
        this.getCapabilityStatements();
    }
}
