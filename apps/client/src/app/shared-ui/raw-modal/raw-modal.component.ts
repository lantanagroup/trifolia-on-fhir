import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAuditPropertyDiff } from '@trifolia-fhir/models';

@Component({
  selector: 'app-raw-modal',
  templateUrl: './raw-modal.component.html',
  styleUrls: ['./raw-modal.component.css']
})
export class RawModalComponent implements OnInit {


  @Input() data: any;
  @Input() title: string = 'View Raw Data';
  @Input() copyEnabled: boolean = true;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  copyToClipboard(data: any) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

}
