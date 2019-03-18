import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../globals';
import {FhirService} from '../../../services/fhir.service';
import {Coding, ElementDefinitionTypeRefComponent} from '../../../models/r4/fhir';
import {FhirReferenceModalComponent} from '../../../fhir-edit/reference-modal/reference-modal.component';

@Component({
    templateUrl: './type-modal.component.html',
    styleUrls: ['./type-modal.component.css']
})
export class R4TypeModalComponent implements OnInit {
    @Input() element: any;
    @Input() type: ElementDefinitionTypeRefComponent;

    public definedTypeCodes: Coding[] = [];
    public Globals = Globals;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private fhirService: FhirService) {
    }

    public selectProfile(array: string[], index: number) {
        const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg' });
        modalRef.componentInstance.resourceType = 'StructureDefinition';
        modalRef.componentInstance.hideResourceType = true;

        modalRef.result.then((results) => {
            array[index] = results.resource.url;
        });
    }

    public addProfile() {
        if (!this.type.profile) {
            this.type.profile = [];
        }

        this.type.profile.push('');
    }

    public addTargetProfile() {
        if (!this.type.targetProfile) {
            this.type.targetProfile = [];
        }

        this.type.targetProfile.push('');
    }

    public addAggregation() {
        if (!this.type.aggregation) {
            this.type.aggregation = [];
        }

        this.type.aggregation.push('');
    }

    ngOnInit() {
        this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
    }
}
