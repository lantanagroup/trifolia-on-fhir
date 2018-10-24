import {Component, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../services/capability-statement.service';
import {CapabilityStatement} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-capability-statements',
    templateUrl: './capability-statements.component.html',
    styleUrls: ['./capability-statements.component.css']
})
export class CapabilityStatementsComponent implements OnInit {
    public capabilityStatements: CapabilityStatement[] = [];
    public contentText: string;

    constructor(
        private configService: ConfigService,
        private csService: CapabilityStatementService,
        private modalService: NgbModal) {
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
        this.capabilityStatements = null;
        this.csService.search()
            .subscribe((results) => {
                this.capabilityStatements = _.map(results.entry, (entry) => <CapabilityStatement> entry.resource);
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while searching for capability statements');
            });
    }

    ngOnInit() {
        this.getCapabilityStatements();
    }
}
