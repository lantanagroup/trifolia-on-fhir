import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkdownModalComponent} from '../../modals/markdown-modal/markdown-modal.component';
import {FhirService} from '../../shared/fhir.service';
import {MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';

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
  @Input() mediaReferences?: MediaReference[];

  @Output() valueChangeEmitter: EventEmitter<void> = new EventEmitter<void>();
  public Globals = Globals;

  constructor(
    private modalService: NgbModal,
    private fhirService: FhirService) {
  }

  openModal() {
    const modalRef = this.modalService.open(MarkdownModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.parentObject = this.parentObject;
    modalRef.componentInstance.propertyName = this.propertyName;
    modalRef.result.then(() => {
      this.valueChangeEmitter.emit();
    });
  }

  valueChanged(value) {
    const changed = this.parentObject[this.propertyName] !== value;
    this.parentObject[this.propertyName] = value;

    if (this.parentObject[this.propertyName] === '') {
      if (this.parentObject.hasOwnProperty(this.propertyName)) {
        // hasOwnProperty tells us if it is a data value. when true, it's a value that should be removed. when false, it's likely a getter/setter that shouldn't be deleted
        delete this.parentObject[this.propertyName];
      }
    }

    if (changed) {
      this.valueChangeEmitter.emit();
    }
  }

  ngOnInit() {
    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    }
  }
}
