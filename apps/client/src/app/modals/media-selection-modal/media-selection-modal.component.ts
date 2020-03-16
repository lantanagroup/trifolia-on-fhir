import {Component, Input, OnInit} from '@angular/core';
import {MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {IBundle} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {Media as STU3Media} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Media as R4Media} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {FhirService} from '../../shared/fhir.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

export class ImageItem {
  name: string;
  title?: string;
}

@Component({
  selector: 'trifolia-fhir-media-selection-modal',
  templateUrl: './media-selection-modal.component.html',
  styleUrls: ['./media-selection-modal.component.css']
})
export class MediaSelectionModalComponent implements OnInit {
  @Input() implementationGuideId?: string;
  @Input() mediaReferences?: MediaReference[];

  message: string;
  images: ImageItem[] = [];
  loading = false;
  totalImages = 0;

  constructor(
    private fhirService: FhirService,
    public activeModal: NgbActiveModal) {

  }

  async loadImages(page = 1) {
    let results: IBundle;
    const query = {};

    if (page === 1) {
      this.images = [];
    }

    this.message = null;
    this.loading = true;

    if (this.implementationGuideId) {
      query['_has:ImplementationGuide:resource:_id'] = this.implementationGuideId;
    } else if (this.mediaReferences && this.mediaReferences.length > 0) {
      query['_ids'] = this.mediaReferences.map((mr) => mr.id);
    }

    try {
      results = await this.fhirService.search('Media', null, true, null, null, query, false, null, page, 10).toPromise();
    } catch (ex) {
      this.message = getErrorString(ex);
      console.error('Error loading images from server: ' + this.message);
      return;
    }

    if (results) {
      this.totalImages = results.total;

      const nextImages = (results.entry || []).map((entry) => {
        const media = <STU3Media | R4Media>entry.resource;

        const imageItem = new ImageItem();
        imageItem.name = media.identifier && media.identifier.length > 0 ? media.identifier[0].value : 'N/A';

        if (media.content && media.content.title) {
          imageItem.title = media.content.title;
        }

        return imageItem;
      });

      this.images.push(...nextImages);
    }

    this.loading = false;
  }

  public async loadMoreImages() {
    const nextPage = (this.images.length / 10) + 1;
    await this.loadImages(nextPage);
  }

  ngOnInit() {
    this.loadImages();
  }

}
