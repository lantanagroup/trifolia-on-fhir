import { Component, Input } from '@angular/core';
import { HumanName } from '../../models/fhir';

@Component({
    selector: 'fhir-edit-human-name',
    templateUrl: './human-name.component.html',
    styleUrls: ['./human-name.component.css']
})
export class HumanNameComponent {
    @Input() parent: any;
    @Input() property: string;

    constructor() { }

    initProperty(shouldInit: boolean) {
        if (!this.parent) {
            return;
        }

        if (shouldInit && !this.parent[this.property]) {
            this.parent[this.property] = new HumanName();
        } else if (!shouldInit && this.parent[this.property]) {
            delete this.parent[this.property];
        }
    }
}
