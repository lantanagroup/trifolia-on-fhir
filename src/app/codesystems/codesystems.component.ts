import {Component, OnInit} from '@angular/core';
import {CodeSystemService} from '../services/code-system.service';
import {CodeSystem, ValueSet} from '../models/fhir';
import * as _ from 'underscore';

@Component({
    selector: 'app-codesystems',
    templateUrl: './codesystems.component.html',
    styleUrls: ['./codesystems.component.css']
})
export class CodesystemsComponent implements OnInit {
    public codeSystems: CodeSystem[];

    constructor(
        private codeSystemService: CodeSystemService) {

    }

    public remove(codeSystem: CodeSystem) {

    }

    ngOnInit() {
        this.codeSystemService.search()
            .subscribe((results) => {
                this.codeSystems = _.map(results.entry, (entry) => <CodeSystem> entry.resource);
            });
    }

}
