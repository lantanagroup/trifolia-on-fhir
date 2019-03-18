import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../globals';
import {FhirService} from '../../../services/fhir.service';
import {Coding, TypeRefComponent} from '../../../models/stu3/fhir';
import {FhirReferenceModalComponent} from '../../../fhir-edit/reference-modal/reference-modal.component';
import {ConfigService} from '../../../services/config.service';

@Component({
    templateUrl: './type-modal.component.html',
    styleUrls: ['./type-modal.component.css']
})
export class STU3TypeModalComponent implements OnInit {
    @Input() element: any;
    @Input() type: TypeRefComponent;
    public definedTypeCodes: Coding[] = [];

    public Globals = Globals;

    constructor(
        public activeModal: NgbActiveModal,
        public configService: ConfigService,
        private modalService: NgbModal,
        private fhirService: FhirService) {
    }

    selectProfile(dest: string) {
        const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg' });
        modalRef.componentInstance.resourceType = 'StructureDefinition';
        modalRef.componentInstance.hideResourceType = true;

        modalRef.result.then((results) => {
            this.type[dest] = results.resource.url;
        });
    }

    ngOnInit() {
        this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
    }
}
