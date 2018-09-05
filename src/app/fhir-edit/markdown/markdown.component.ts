import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkdownModalComponent} from '../../markdown-modal/markdown-modal.component';
import {FhirService} from '../../services/fhir.service';

@Component({
    selector: 'app-fhir-markdown',
    templateUrl: './markdown.component.html',
    styleUrls: ['./markdown.component.css']
})
export class FhirMarkdownComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() isOptional = true;
    @Input() isFormGroup = true;
    @Input() defaultValue = '';
    @Input() tooltip: string;
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;
    @Input() displayOnly = false;

    constructor(
        public globals: Globals,
        private modalService: NgbModal,
        private fhirService: FhirService) {
    }

    openModal() {
        const modalRef = this.modalService.open(MarkdownModalComponent, { size: 'lg' });
        modalRef.componentInstance.parentObject = this.parentObject;
        modalRef.componentInstance.propertyName = this.propertyName;
    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = this.globals.tooltips[this.tooltipKey];
        } else if (this.tooltipPath) {
            this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
        }
    }
}
