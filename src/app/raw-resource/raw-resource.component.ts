import {Component, Input, OnInit} from '@angular/core';
import {Resource} from '../models/stu3/fhir';

@Component({
    selector: 'app-raw-resource',
    templateUrl: './raw-resource.component.html',
    styleUrls: ['./raw-resource.component.css']
})
export class RawResourceComponent implements OnInit {
    @Input() resource: Resource;

    constructor() {
    }

    ngOnInit() {
    }
}
