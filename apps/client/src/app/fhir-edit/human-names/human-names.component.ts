import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {HumanName} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';

@Component({
    selector: 'app-fhir-human-names',
    templateUrl: './human-names.component.html',
    styleUrls: ['./human-names.component.css']
})
export class FhirHumanNamesComponent implements OnChanges, OnInit {
    humanNames: HumanName[];
    @Input() title = 'Name(s)';
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() required = false;

    public Globals = Globals;

    constructor() { }

    ngOnChanges(changes) {

    }

    ngOnInit() {
        if (this.required && this.parentObject) {
            if (!this.parentObject[this.propertyName]) {
                this.parentObject[this.propertyName] = [{ given: [''], family: '' }];
            } else {
                if (!this.parentObject[this.propertyName].given) {
                    this.parentObject[this.propertyName].given = [''];
                }
                if (!this.parentObject[this.propertyName].hasOwnProperty('family')) {
                    this.parentObject[this.propertyName].family = '';
                }
            }
        }
    }
}
