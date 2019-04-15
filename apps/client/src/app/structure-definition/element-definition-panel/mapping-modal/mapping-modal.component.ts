import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ElementDefinitionMappingComponent} from '../../../models/stu3/fhir';

@Component({
    selector: 'app-mapping-modal',
    templateUrl: './mapping-modal.component.html',
    styleUrls: ['./mapping-modal.component.css']
})
export class MappingModalComponent implements OnInit {
    @Input() mappings: ElementDefinitionMappingComponent[];

    constructor(
        public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }

}
