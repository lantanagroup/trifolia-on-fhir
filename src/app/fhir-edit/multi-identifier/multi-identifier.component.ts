import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {Identifier} from '../../models/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirIdentifierModalComponent} from '../identifier-modal/identifier-modal.component';
import {FhirService} from '../../services/fhir.service';

@Component({
    selector: 'app-fhir-multi-identifier',
    templateUrl: './multi-identifier.component.html',
    styleUrls: ['./multi-identifier.component.css']
})
export class FhirMultiIdentifierComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    @Input() title: string;
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;

    public tooltip: string;
    public Globals = Globals;

    constructor(private modalService: NgbModal,
                private fhirService: FhirService) {

    }

    public editIdentifier(identifier: Identifier) {
        const ref = this.modalService.open(FhirIdentifierModalComponent, {size: 'lg'});
        ref.componentInstance.identifier = identifier;
    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = Globals.tooltips[this.tooltipKey];
        } else if (this.tooltipPath) {
            this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
        }
    }
}
