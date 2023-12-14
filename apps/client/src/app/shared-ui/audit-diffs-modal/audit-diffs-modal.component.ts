import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAuditPropertyDiff } from '@trifolia-fhir/models';

@Component({
  selector: 'app-audit-diffs-modal',
  templateUrl: './audit-diffs-modal.component.html',
  styleUrls: ['./audit-diffs-modal.component.css']
})
export class AuditDiffsModalComponent implements OnInit {

  @Input() propertyDiffs: IAuditPropertyDiff[] = [];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  copyToClipboard(data: any) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

}
