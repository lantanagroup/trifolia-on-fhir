import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-choice-modal',
  templateUrl: './select-choice-modal.component.html',
  styleUrls: ['./select-choice-modal.component.css']
})
export class SelectChoiceModalComponent implements OnInit {
  @Input() element: any;
  @Input() structureDefinition: any;
  public selectedType: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
}
