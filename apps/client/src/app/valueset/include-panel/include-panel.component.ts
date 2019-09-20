import {Component, Input, OnInit} from '@angular/core';
import {ConceptSetComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {FhirReferenceModalComponent} from '../../fhir-edit/reference-modal/reference-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-valueset-include-panel',
  templateUrl: './include-panel.component.html',
  styleUrls: ['./include-panel.component.css']
})
export class IncludePanelComponent implements OnInit {
  @Input() include: ConceptSetComponent;

  public Globals = Globals;

  constructor(private modalService: NgbModal) {
  }

  public selectIncludeValueSet(include: ConceptSetComponent, index) {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, {size: 'lg'});
    modalRef.componentInstance.resourceType = 'ValueSet';
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((results) => {
      include.valueSet[index] = results.resource.url;
    });
  }

  ngOnInit() {
  }
}
