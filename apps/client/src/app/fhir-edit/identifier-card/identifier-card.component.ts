import {Component, Input, OnInit} from '@angular/core';
import {Identifier as STU3Identifier} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Identifier as R4Identifier} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trifolia-fhir-identifier-card',
  templateUrl: './identifier-card.component.html',
  styleUrls: ['./identifier-card.component.css']
})
export class FhirEditIdentifierCardComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;

  modalIdentifier: STU3Identifier | R4Identifier;

  constructor(private modalService: NgbModal) { }

  get identifiers(): Array<STU3Identifier | R4Identifier> {
    if (!this.parentObject[this.propertyName]) {
      return [];
    }

    return <Array<STU3Identifier | R4Identifier>> this.parentObject[this.propertyName];
  }

  addIdentifier() {
    if (!this.parentObject[this.propertyName]) {
      this.parentObject[this.propertyName] = [];
    }

    this.identifiers.push(new R4Identifier());
    this.identifiers[this.identifiers.length - 1].use = 'official';
  }

  openModal(content, identifier: STU3Identifier | R4Identifier) {
    this.modalIdentifier = identifier;

    const modalRef = this.modalService.open(content, {backdrop: 'static'});

    modalRef.result
      .then(() => {
        this.modalIdentifier = null;
      })
      .catch(() => {
        this.modalIdentifier = null;
      });
  }

  ngOnInit() {
    if (this.parentObject[this.propertyName] && !(this.parentObject[this.propertyName] instanceof Array)) {
      this.parentObject[this.propertyName] = [];
    }
  }
}
