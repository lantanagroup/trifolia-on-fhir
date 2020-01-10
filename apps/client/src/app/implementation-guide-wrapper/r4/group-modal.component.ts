import {Component, Input, OnInit} from '@angular/core';
import {ImplementationGuide, ImplementationGuideGroupingComponent} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trifolia-fhir-group-modal',
  templateUrl: './group-modal.component.html',
  styleUrls: ['./group-modal.component.css']
})
export class GroupModalComponent implements OnInit {
  @Input() group: ImplementationGuideGroupingComponent;
  @Input() implementationGuide: ImplementationGuide;

  groupClone: ImplementationGuideGroupingComponent;

  constructor(public activeModal: NgbActiveModal) { }

  get isIdValid(): boolean {
    const otherGroupIds = this.implementationGuide.definition.grouping
      .filter(g => g !== this.group)
      .map(g => g.id);

    return otherGroupIds.indexOf(this.groupClone.id) < 0;
  }

  ok() {
    if (this.groupClone.id !== this.group.id) {
      (this.implementationGuide.definition.resource || [])
        .filter(r => r.groupingId === this.group.id)
        .forEach(r => r.groupingId = this.groupClone.id);
    }

    this.group.id = this.groupClone.id;
    this.group.name = this.groupClone.name;

    if (this.groupClone.description) {
      this.group.description = this.groupClone.description;
    } else {
      delete this.group.description;
    }

    this.activeModal.close(this.group);
  }

  ngOnInit() {
    this.groupClone = JSON.parse(JSON.stringify(this.group));
  }
}
