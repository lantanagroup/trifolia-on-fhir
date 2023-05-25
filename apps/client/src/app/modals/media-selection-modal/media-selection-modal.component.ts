import {Component, Input, OnInit} from '@angular/core';
import {MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {IBundle} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {Media as STU3Media} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Media as R4Media} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {FhirService} from '../../shared/fhir.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../../shared/config.service';
import {IConformance} from '@trifolia-fhir/models';

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
  @Input() mediaReferences?: MediaReference[];

  message: string;
  images: ImageItem[] = [];
  loading = false;
  totalImages = 0;

  constructor(
    private configService: ConfigService,
    private fhirService: FhirService,
    public activeModal: NgbActiveModal) {

  }

  async loadImages(page = 1) {
    let metadataResult;
    const query = {};

    if (page === 1) {
      this.images = [];
    }

    this.message = null;
    this.loading = true;

    if (this.mediaReferences && this.mediaReferences.length > 0) {
      query['_ids'] = this.mediaReferences.map((mr) => mr.id);
    } else if (this.configService.project && this.configService.project.implementationGuideId) {
      query['_has:ImplementationGuide:resource:_id'] = this.configService.project.implementationGuideId;
    }

    try {
      metadataResult = await this.fhirService.search('Media', null, true, null, null, this.configService.project.implementationGuideId, null, false, null, 1).toPromise();
    } catch (ex) {
      this.message = getErrorString(ex);
      console.error('Error loading images from server: ' + this.message);
      return;
    }
    let results = metadataResult.results;
    if (results) {
      this.totalImages = metadataResult.total;

      const nextImages = (results|| []).map((entry) => {
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
