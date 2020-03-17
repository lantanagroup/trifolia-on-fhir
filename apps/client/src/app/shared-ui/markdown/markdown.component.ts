import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../shared/fhir.service';
import {Bundle, Media as STU3Media} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Media as R4Media} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import * as simplemde from 'simplemde-antd/dist/simplemde.min';
import {SimplemdeComponent} from 'ngx-simplemde';

class ImageItem {
  mediaId: string;
  name: string;
  title?: string;
  description?: string;
}

/**
 * This class include generic markdown functionality for all markdown fields in Trifolia-on-FHIR. The fhir-edit-markdown component
 * provides more fhir-specific functionality for markdown.
 */
@Component({
  selector: 'trifolia-fhir-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css']
})
export class MarkdownComponent implements OnInit {
  @ViewChild('imageListModal', { static: true }) imageListModal;
  @Input() value: string;
  @Output() valueChange = new EventEmitter();
  @Input() disabled = false;
  @Input() mediaReferences: MediaReference[];
  @Input() imageListButtonTitle = 'Insert image from pre-defined list';

  @ViewChild('smde', { static: true })
  private simplemde: SimplemdeComponent;

  public imagesError: string;
  public totalImages = 0;
  public loadingImages = false;
  private images: ImageItem[];
  public toolbar: any[];

  constructor(
    private modalService: NgbModal,
    private fhirService: FhirService) {

    this.toolbar = [
      {
        name: "bold",
        action: simplemde.toggleBold,
        className: "smdi smdi-bold",
        title: "Bold",
        default: true
      },
      {
        name: "italic",
        action: simplemde.toggleItalic,
        className: "smdi smdi-italic",
        title: "Italic",
        default: true
      },
      {
        name: "strikethrough",
        action: simplemde.toggleStrikethrough,
        className: "smdi smdi-strikethrough",
        title: "Strike-through",
        default: true
      },
      {
        name: "heading",
        action: simplemde.toggleHeadingSmaller,
        className: "smdi smdi-header",
        title: "Heading",
        default: true
      },
      /*
      {
        name: "heading-smaller",
        action: simplemde.toggleHeadingSmaller,
        className: "smdi smdi-header fa-header-x fa-header-smaller",
        title: "小号标题"
      },
      {
        name: "heading-bigger",
        action: simplemde.toggleHeadingBigger,
        className: "smdi smdi-header fa-header-x fa-header-bigger",
        title: "大号标题"
      },
      {
        name: "heading-1",
        action: simplemde.toggleHeading1,
        className: "smdi smdi-header fa-header-x fa-header-1",
        title: "标题1"
      },
      {
        name: "heading-2",
        action: simplemde.toggleHeading2,
        className: "smdi smdi-header fa-header-x fa-header-2",
        title: "标题2"
      },
      {
        name: "heading-3",
        action: simplemde.toggleHeading3,
        className: "smdi smdi-header fa-header-x fa-header-3",
        title: "标题3"
      },
       */
      '|',
      {
        name: "code",
        action: simplemde.toggleCodeBlock,
        className: "smdi smdi-code",
        title: "Code block",
        default: true
      },
      {
        name: "quote",
        action: simplemde.toggleBlockquote,
        className: "smdi smdi-quote-left",
        title: "Quote",
        default: true
      },
      {
        name: "unordered-list",
        action: simplemde.toggleUnorderedList,
        className: "smdi smdi-list-ul",
        title: "Unordered list",
        default: true
      },
      {
        name: "ordered-list",
        action: simplemde.toggleOrderedList,
        className: "smdi smdi-list-ol",
        title: "Ordered list",
        default: true
      },
      /*
      {
        name: "clean-block",
        action: simplemde.cleanBlock,
        className: "smdi smdi-eraser fa-clean-block",
        title: "Clean block",
        default: true
      },
       */
      '|',
      {
        name: "link",
        action: simplemde.drawLink,
        className: "smdi smdi-link",
        title: "Link",
        default: true
      },
      {
        name: "image",
        action: simplemde.drawImage,
        className: "smdi smdi-image",
        title: "Image",
        default: true
      },
      this.createImageListToolbar(),
      {
        name: "table",
        action: simplemde.drawTable,
        className: "smdi smdi-table",
        title: "Table",
        default: true
      },
      {
        name: "horizontal-rule",
        action: simplemde.drawHorizontalRule,
        className: "smdi smdi-line",
        title: "Horizontal rule",
        default: true
      },
      '|',
      {
        name: "preview",
        action: simplemde.togglePreview,
        className: "smdi smdi-eye no-disable",
        title: "Preview",
        default: true
      },
      /*
      {
        name: "fullscreen",
        action: simplemde.toggleFullScreen,
        className: "smdi smdi-fullscreen no-disable no-mobile",
        title: "Fullscreen",
        default: true
      },
       */
      '|',
      {
        name: "undo",
        action: simplemde.undo,
        className: "smdi smdi-undo no-disable",
        title: "Undo",
        default: true
      },
      {
        name: "redo",
        action: simplemde.redo,
        className: "smdi smdi-redo no-disable",
        title: "Redo",
        default: true
      },
      '|',
      {
        name: "guide",
        action: "http://wowubuntu.com/markdown/index.html",
        className: "smdi smdi-question",
        title: "Markdown Guide",
        default: true
      }
    ];
  }

  createImageListToolbar() {
    return {
      name: 'image-list',
      className: 'fas fa-images',
      title: this.imageListButtonTitle,

      // This action is called when the user clicks the button
      // It will open the imageListModal that is embedded in the HTML of this component
      // When the modal closes, the user will have selected the image they want inserted
      action: (event) => {
        this.modalService.open(this.imageListModal, { size: 'lg', backdrop: 'static' }).result
          .then((image: ImageItem) => {
            const doc = event.codemirror.getDoc();
            const cursor = doc.getCursor();

            const altTag = image.title ? `alt="${image.title}" ` : '';
            const replaceText = `<table><tr><td><img src="${image.name}" ${altTag}/></td></tr></table>`;
            doc.replaceRange(replaceText, cursor);
          });
      }
    };
  }

  public loadMoreImages() {
    const nextPage = (this.images.length / 10) + 1;
    this.populateImages(nextPage);
  }

  private populateImages(page = 1) {
    if (page === 1) {
      this.images = [];
    }

    if (this.mediaReferences && this.mediaReferences.length > 0) {
      const ids = this.mediaReferences.map((mr) => mr.id);

      this.imagesError = null;
      this.loadingImages = true;

      this.fhirService.search('Media', null, true, null, null, {_id: ids}, false, false, page, 10).toPromise()
        .then((results: Bundle) => {
          this.totalImages = results.total;
          const nextImages = (results.entry || []).map((entry) => {
            const mediaReference = this.mediaReferences.find((mr) => mr.id === entry.resource.id);
            const media = <STU3Media | R4Media> entry.resource;

            const imageItem = new ImageItem();
            imageItem.name = media.identifier && media.identifier.length > 0 ? media.identifier[0].value : 'N/A';
            imageItem.title = mediaReference.name;
            imageItem.description = mediaReference.description;
            return imageItem;
          });

          this.images = this.images.concat(nextImages);

          if (this.totalImages !== ids.length) {
            this.imagesError = `The implementation guide references ${ids.length} images (Media resources), but you only have access to ${this.totalImages}.`;
          }

          this.loadingImages = false;
        })
        .catch((err) => {
          this.imagesError = getErrorString(err);
          this.loadingImages = false;
        });
    } else {
      this.images = [];
    }
  }

  ngOnInit(): void {
    this.populateImages();
  }
}
