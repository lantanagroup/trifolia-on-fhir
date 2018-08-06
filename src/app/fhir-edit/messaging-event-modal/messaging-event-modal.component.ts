import {Component, Input, OnInit} from '@angular/core';
import {EventComponent} from '../../models/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';

@Component({
    selector: 'app-fhir-messaging-event-modal',
    templateUrl: './messaging-event-modal.component.html',
    styleUrls: ['./messaging-event-modal.component.css']
})
export class FhirEditMessagingEventModalComponent implements OnInit {
    @Input() event: EventComponent;

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {

    }

    ngOnInit() {
    }
}
