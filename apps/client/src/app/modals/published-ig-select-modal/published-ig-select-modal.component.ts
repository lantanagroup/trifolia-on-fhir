import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImplementationGuideService, PublishedGuideContainerModel, PublishedGuideEditionsModel, PublishedGuideModel} from '../../shared/implementation-guide.service';
import {PublishedIgEditionSelectModalComponent} from './published-ig-edition-select-modal/published-ig-edition-select-modal.component';

@Component({
  selector: 'app-published-ig-select-modal',
  templateUrl: './published-ig-select-modal.component.html',
  styleUrls: ['./published-ig-select-modal.component.css']
})
export class PublishedIgSelectModalComponent implements OnInit {
  public guides: PublishedGuideContainerModel[];
  public filterPublishedIGQuery: string;

  constructor(
    public activeModal: NgbActiveModal,
    private modal: NgbModal,
    private igService: ImplementationGuideService) {
  }

  selectPublishedEdition(guide: PublishedGuideContainerModel) {
    const modalRef = this.modal.open(PublishedIgEditionSelectModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.editions = guide.editions;
    modalRef.componentInstance.canonical = guide.canonical;
    modalRef.componentInstance.name = guide.name;
    modalRef.componentInstance.packageName = guide['npm-name'];
    modalRef.result.then((edition: PublishedGuideEditionsModel) => {
      if (edition) {
        const publishedGuide: PublishedGuideModel =
          {
            name: guide.name,
            url: edition.url,
            version: edition.version,
            'npm-name': guide['npm-name']
          };

        this.activeModal.close(publishedGuide);
      }
    })
  }

  public get guideList(): PublishedGuideContainerModel[]{
    return this.guides
      .filter((guide: PublishedGuideContainerModel) => {
        if(!this.filterPublishedIGQuery){
          return true;
        }

        const reference = guide.name.toLowerCase().trim();

        return reference.indexOf(this.filterPublishedIGQuery.toLowerCase().trim()) >= 0;
      });
  }

  ngOnInit() {
    this.igService.getPublished()
      .subscribe((results) => {
        results = results.sort(function(a,b) {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
        });
        this.guides = results;
      }, (err) => {
        // TODO
      });
  }
}
