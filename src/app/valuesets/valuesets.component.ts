import {Component, OnInit} from '@angular/core';
import {ValueSetService} from '../services/value-set.service';
import {ValueSet} from '../models/fhir';
import * as _ from 'underscore';

@Component({
    selector: 'app-valuesets',
    templateUrl: './valuesets.component.html',
    styleUrls: ['./valuesets.component.css']
})
export class ValuesetsComponent implements OnInit {
    public valueSets: ValueSet[];

    constructor(
        private valueSetService: ValueSetService) {

    }

    public remove(valueSet: ValueSet) {

    }

    ngOnInit() {
        this.valueSetService.search()
            .subscribe((results) => {
                this.valueSets = _.map(results.entry, (entry) => <ValueSet> entry.resource);
            });
    }

}
