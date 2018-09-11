import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {HumanName} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-edit-human-names',
    templateUrl: './human-names.component.html',
    styleUrls: ['./human-names.component.css']
})
export class HumanNamesComponent implements OnChanges, OnInit {
    humanNames: HumanName[];
    @Input() title = 'Name';
    @Input() parent: any;
    @Input() property: string;

    constructor() { }

    initProperty(shouldInit: boolean) {
        if (!this.parent) {
            return;
        }

        if (shouldInit && !this.parent[this.property]) {
            this.parent[this.property] = [];
        } else if (!shouldInit && this.parent[this.property]) {
            delete this.parent[this.property];
        }

        this.updateHumanNames();
    }

    addName() {
        if (!this.humanNames) {
            return;
        }

        this.humanNames.push(new HumanName());
    }

    private updateHumanNames() {
        if (this.parent) {
            this.humanNames = this.parent[this.property];
        } else {
            this.humanNames = null;
        }
    }

    addGiven(humanName) {
        if (!humanName.given) {
            humanName.given = [];
        }
        humanName.given.push('');
    }

    ngOnChanges(changes) {
        this.updateHumanNames();
    }

    ngOnInit() {
        this.updateHumanNames();
    }

    trackByIndex(index, item) {
        return index;
    }
}
