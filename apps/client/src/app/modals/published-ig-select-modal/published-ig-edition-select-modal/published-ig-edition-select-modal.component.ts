import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuideService, PublishedGuideEditionsModel} from '../../../shared/implementation-guide.service';

@Component({
  selector: 'trifolia-fhir-published-ig-edition-select-modal',
  templateUrl: './published-ig-edition-select-modal.component.html',
  styleUrls: ['./published-ig-edition-select-modal.component.css']
})
export class PublishedIgEditionSelectModalComponent implements OnInit {
  @Input() public editions: Object[];
  @Input() public canonical: string;
  @Input() public name: string;
  @Input() public packageName: string;
  public versions: string[];

  constructor(
    public activeModal: NgbActiveModal,
    private igService: ImplementationGuideService) {
    console.log('ctor');

  }

  public selectEdition(e: string) {
    const editionModel: PublishedGuideEditionsModel = {
      url: this.canonical + '/ImplementationGuide/' + this.packageName + '#' + e,
      version: e
    };
    this.activeModal.close(editionModel);
  }


  ngOnInit() {
    console.log('init');

    this.igService.getEditions(this.name).subscribe((results) => {
      this.versions = results.map((e) => e.version);
    }, (err) => {
      this.versions = [
        (this.editions || [])[0]['ig-version'],
        'current'
      ];


    });
  }

}
