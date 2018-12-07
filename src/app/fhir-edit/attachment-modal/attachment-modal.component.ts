import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Attachment} from '../../models/stu3/fhir';

@Component({
    selector: 'app-fhir-attachment-modal',
    templateUrl: './attachment-modal.component.html',
    styleUrls: ['./attachment-modal.component.css']
})
export class FhirAttachmentModalComponent implements OnInit {
    @Input() attachment: Attachment;

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {

    }

    public attachmentUpload(event) {
        const reader = new FileReader();

        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.onload = () => {
                this.attachment.data = reader.result.substring(reader.result.indexOf('base64,') + 7);
                this.attachment.contentType = file.type;
                this.attachment.size = file.size;
                this.attachment.title = file.name;
                delete this.attachment.url;
            };
            reader.readAsDataURL(file);
        }
    }

    ngOnInit() {
    }
}
