import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {ContactDetail} from '../../models/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirContactModalComponent} from '../contact-modal/contact-modal.component';
import {FhirService} from '../../services/fhir.service';

@Component({
    selector: 'app-fhir-multi-contact',
    templateUrl: './multi-contact.component.html',
    styleUrls: ['./multi-contact.component.css']
})
export class FhirMultiContactComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;

    public tooltip: string;
    public Globals = Globals;

    constructor(
        private modalService: NgbModal,
        private fhirService: FhirService) {

    }

    public editContact(contact: ContactDetail) {
        const ref = this.modalService.open(FhirContactModalComponent, { size: 'lg' });
        ref.componentInstance.contact = contact;
    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = Globals.tooltips[this.tooltipKey];
        } else if (this.tooltipPath) {
            this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
        }
    }
}
