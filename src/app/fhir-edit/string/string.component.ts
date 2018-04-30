import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'fhir-edit-string',
    templateUrl: './string.component.html',
    styleUrls: ['./string.component.css']
})
export class StringComponent implements OnInit {
    @Input() parent: any;
    @Input() property: string;
    @Input() title: string;

    constructor() {

    }

    ngOnInit() {
    }
}
