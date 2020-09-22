import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {Attachment} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirAttachmentModalComponent} from '../attachment-modal/attachment-modal.component';

@Component({
  selector: 'app-fhir-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class FhirAttachmentComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() required = false;
  @Input() isFormGroup = true;
  @Input() defaultValue = {};
  @Input() tooltip: string;
  @Input() tooltipKey: string;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  public Globals = Globals;

  constructor(private modalService: NgbModal) {

  }

  editAttachment() {
    const modalRef = this.modalService.open(FhirAttachmentModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.attachment = this.parentObject[this.propertyName];
    modalRef.result.then(() => {
      this.change.emit();
    });
  }

  getDisplay() {
    if (!this.parentObject || !this.parentObject[this.propertyName]) {
      return 'No attachment';
    }

    const attachment = <Attachment>this.parentObject[this.propertyName];

    return attachment.title ||
      attachment.contentType ||
      (attachment.size ? 'size: ' + attachment.size.toString() : '') ||
      attachment.url ||
      'Has attachment';
  }

  ngOnInit() {
    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    }
  }
}
