import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {Identifier} from '../../models/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IdentifierModalComponent} from '../identifier-modal/identifier-modal.component';

@Component({
    selector: 'app-fhir-multi-identifier',
    templateUrl: './multi-identifier.component.html',
    styleUrls: ['./multi-identifier.component.css']
})
export class MultiIdentifierComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() tooltip: string;
    @Input() tooltipKey: string;

    constructor(public globals: Globals,
                private modalService: NgbModal) {

    }

    public editIdentifier(identifier: Identifier) {
        const ref = this.modalService.open(IdentifierModalComponent, {size: 'lg'});
        ref.componentInstance.identifier = identifier;
    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = this.globals.tooltips[this.tooltipKey];
        }
    }
}
