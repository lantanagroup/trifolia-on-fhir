import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';

@Component({
    selector: 'app-fhir-multi-jurisdiction',
    templateUrl: './multi-jurisdiction.component.html',
    styleUrls: ['./multi-jurisdiction.component.css']
})
export class MultiJurisdictionComponent implements OnInit {
    @Input() parentObject: any;
    @Input() property: string;

    constructor(public globals: Globals) {
    }

    ngOnInit() {
    }

}
