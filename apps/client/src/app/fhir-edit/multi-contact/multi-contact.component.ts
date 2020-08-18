import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {ContactDetail} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirContactModalComponent} from '../contact-modal/contact-modal.component';
import {FhirService} from '../../shared/fhir.service';

@Component({
  selector: 'app-fhir-multi-contact',
  templateUrl: './multi-contact.component.html',
  styleUrls: ['./multi-contact.component.css']
})
export class FhirMultiContactComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;

  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  public tooltip: string;
  public Globals = Globals;

  constructor(
    private modalService: NgbModal,
    private fhirService: FhirService) {

  }

  public editContact(contact: ContactDetail) {
    const ref = this.modalService.open(FhirContactModalComponent, {size: 'lg', backdrop: 'static'});
    ref.componentInstance.contact = contact;
    ref.result.then(() => {this.change.emit();})
  }

  public firstContact(index: number){
    return index === 0;
  }

  public lastContact(index: number){
    return index === this.parentObject[this.propertyName].length - 1;
  }

  public pushContactUp(contact: ContactDetail, index: number){
    const current = this.parentObject[this.propertyName][index];
    const above = this.parentObject[this.propertyName][index-1];
    this.parentObject[this.propertyName][index-1] = current;
    this.parentObject[this.propertyName][index] = above;
  }

  public pushContactDown(contact: ContactDetail, index: number){
    const current = this.parentObject[this.propertyName][index];
    const below = this.parentObject[this.propertyName][index+1];
    this.parentObject[this.propertyName][index+1] = current;
    this.parentObject[this.propertyName][index] = below;
  }

  ngOnInit() {
    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    }
  }
}
