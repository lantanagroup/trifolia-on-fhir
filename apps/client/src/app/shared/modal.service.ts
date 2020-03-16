import {Injectable} from '@angular/core';
import {MediaReference} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {ImageItem, MediaSelectionModalComponent} from '../modals/media-selection-modal/media-selection-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ModalService {

  constructor(private modalService: NgbModal) {
  }

  async getMediaSelection(implementationGuideId?: string, mediaReferences?: MediaReference[]): Promise<ImageItem> {
    const modalRef = this.modalService.open(MediaSelectionModalComponent, { container: 'body', backdrop: 'static' });
    modalRef.componentInstance.implementationGuideId = implementationGuideId;
    modalRef.componentInstance.mediaReferences = mediaReferences;
    return await modalRef.result;
  }
}
