import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {FhirService} from '../../services/fhir.service';
import {Coding} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-element-definition-type-modal',
    templateUrl: './element-definition-type-modal.component.html',
    styleUrls: ['./element-definition-type-modal.component.css']
})
export class ElementDefinitionTypeModalComponent implements OnInit {
    @Input() element: any;
    @Input() type: any;
    public definedTypeCodes: Coding[] = [];

    constructor(
        public activeModal: NgbActiveModal,
        private fhirService: FhirService,
        public globals: Globals) {
    }

    ngOnInit() {
        this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
    }
}
