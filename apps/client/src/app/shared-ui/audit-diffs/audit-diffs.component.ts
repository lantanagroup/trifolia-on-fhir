import { Component, Input, OnInit } from '@angular/core';
import { IAuditPropertyDiff } from '@trifolia-fhir/models';

@Component({
  selector: 'app-audit-diffs',
  templateUrl: './audit-diffs.component.html',
  styleUrls: ['./audit-diffs.component.css']
})
export class AuditDiffsComponent implements OnInit {

  @Input() propertyDiffs: IAuditPropertyDiff[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
