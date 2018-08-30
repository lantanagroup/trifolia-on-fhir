import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../services/fhir.service';
import {Globals} from '../globals';

@Component({
    selector: 'app-change-resource-id-modal',
    templateUrl: './change-resource-id-modal.component.html',
    styleUrls: ['./change-resource-id-modal.component.css']
})
export class ChangeResourceIdModalComponent implements OnInit {
    @Input() resourceType: string;
    @Input() originalId: string;
    public newId: string;
    public message: string;

    constructor(
        public activeModal: NgbActiveModal,
        private fhirService: FhirService,
        private globals: Globals) {
    }

    public ok() {
        this.fhirService.changeResourceId(this.resourceType, this.originalId, this.newId)
            .subscribe(() => {
                this.activeModal.close(this.newId);
            }, (err) => {
                this.message = this.globals.getErrorMessage(err);
            });
    }

    ngOnInit() {
        this.newId = this.originalId;
    }
}
