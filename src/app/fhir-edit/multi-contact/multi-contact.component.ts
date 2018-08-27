import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {ContactDetail} from '../../models/stu3/fhir';
import * as _ from 'underscore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContactModalComponent} from '../contact-modal/contact-modal.component';

@Component({
    selector: 'app-fhir-multi-contact',
    templateUrl: './multi-contact.component.html',
    styleUrls: ['./multi-contact.component.css']
})
export class MultiContactComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() tooltip: string;
    @Input() tooltipKey: string;

    constructor(
        private modalService: NgbModal,
        public globals: Globals) {

    }

    public editContact(contact: ContactDetail) {
        const ref = this.modalService.open(ContactModalComponent, { size: 'lg' });
        ref.componentInstance.contact = contact;
    }

    public getTelecomDisplay(contact: ContactDetail) {
        const telecoms = _.map(contact.telecom, (telecom) => {
            if (telecom.system) {
                return telecom.value + ' (' + telecom.system + ')';
            } else {
                return telecom.value;
            }
        });
        const telecomsString = telecoms.join(', ');

        if (telecomsString.length > 50) {
            return telecomsString.substring(0, 50) + '...';
        }

        return telecomsString;
    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = this.globals.tooltips[this.tooltipKey];
        }
    }
}
