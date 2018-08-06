import {Component, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../services/capability-statement.service';
import {CapabilityStatement} from '../models/stu3/fhir';
import * as _ from 'underscore';

@Component({
    selector: 'app-capability-statements',
    templateUrl: './capability-statements.component.html',
    styleUrls: ['./capability-statements.component.css']
})
export class CapabilityStatementsComponent implements OnInit {
    public capabilityStatements: CapabilityStatement[] = [];

    constructor(private csService: CapabilityStatementService) {
    }

    public remove(capabilityStatement: CapabilityStatement) {

    }

    ngOnInit() {
        this.csService.search()
            .subscribe((results) => {
                this.capabilityStatements = _.map(results.entry, (entry) => <CapabilityStatement> entry.resource);
            });
    }
}
