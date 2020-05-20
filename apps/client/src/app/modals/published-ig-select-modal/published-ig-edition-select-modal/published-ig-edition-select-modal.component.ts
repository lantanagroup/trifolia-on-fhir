import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PublishedGuideEditionsModel} from '../../../shared/implementation-guide.service';

@Component({
  selector: 'trifolia-fhir-published-ig-edition-select-modal',
  templateUrl: './published-ig-edition-select-modal.component.html',
  styleUrls: ['./published-ig-edition-select-modal.component.css']
})
export class PublishedIgEditionSelectModalComponent implements OnInit {
  @Input() public editions: Object[];

  constructor(public activeModal: NgbActiveModal) {
    console.log('ctor');
  }

  public selectEdition(e: Object) {
    const editionModel: PublishedGuideEditionsModel = {
      url: e['url'],
      version: e['ig-version']
    };
    this.activeModal.close(editionModel);
  }


  ngOnInit() {
    console.log('init');
  }

}
