import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from '../../globals';

@Component({
    selector: 'app-fhir-string',
    templateUrl: './string.component.html',
    styleUrls: ['./string.component.css']
})
export class StringComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() required = false;
    @Input() isFormGroup = true;
    @Input() defaultValue = '';
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;
    @Input() placeholder: string;
    @Input() disabled: boolean;
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        public globals: Globals) {

    }

    public onChanged() {
        this.change.emit(this.parentObject[this.propertyName]);
    }

    ngOnInit() {
    }
}
