import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy, OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as SimpleMDE from 'simplemde';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../shared/fhir.service';
import {Bundle, Media as STU3Media} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Media as R4Media} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';

const MARKDOWN_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MarkdownComponent),
  multi: true
}

export class NgModelBase implements ControlValueAccessor {
  public onTouchedCallback: () => {};
  public onChangeCallback: (_: any) => {};
  public _innerValue: any;

  set value(v: any) {
    if (v !== this._innerValue) {
      this._innerValue = v;
      this.onChangeCallback(v);
    }
  }

  get value(): any {
    return this._innerValue;
  }

  writeValue(v: any) {
    if (v !== this._innerValue) {
      this._innerValue = v;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}

class ImageItem {
  mediaId: string;
  name: string;
  title?: string;
  description?: string;
};

export class MediaReference {
  id: string;
  name: string;     // this becomes ImageItem.title
  description: string;
}

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css'],
  providers: [MARKDOWN_CONTROL_VALUE_ACCESSOR]
})
export class MarkdownComponent extends NgModelBase implements AfterContentChecked, AfterViewInit, OnDestroy, OnChanges, OnInit {
  @ViewChild('simplemde', { static: true }) textarea: ElementRef;
  @ViewChild('imageListModal', { static: true }) imageListModal;
  @Input() disabled = false;
  @Input() mediaReferences: MediaReference[];
  @Input() imageListButtonTitle = 'Insert image from pre-defined list';

  private images: ImageItem[];
  private isVisible = false;
  private simplemde: SimpleMDE;
  private tmpValue = null;

  constructor(
    private modalService: NgbModal,
    private fhirService: FhirService) {

    super();
  }

  /**
   * Replaces the non-ascii dash character with the ascii dash character
   * Removes any remaining non-ascii characters
   * @param value {string} The value to fix/replace/remove
   */
  private getFixedValue(value: string) {
    if (!value) {
      return value;
    }

    return value
      .replace(/–/g, '-')
      .replace(/[^\x00-\x7F]/g, '');
  }

  writeValue(v: any) {
    if (v !== this._innerValue) {
      this._innerValue = v;

      if (this.simplemde) {
        if (this.value === undefined) {
          this.simplemde.value('');
        } else {
          const fixedValue = this.getFixedValue(this.value);
          this.simplemde.value(fixedValue);
        }
      }

      if (!this.simplemde) {
        this.tmpValue = this.value;
      }
    }
  }

  createImageListToolbar() {
    return {
      name: 'image-list',
      className: 'fas fa-images',
      title: this.imageListButtonTitle,

      // This action is called when the user clicks the button
      // It will open the imageListModal that is embedded in the HTML of this component
      // When the modal closes, the user will have selected the image they want inserted
      action: () => {
        this.modalService.open(this.imageListModal, { size: 'lg', backdrop: 'static' }).result
          .then((image: ImageItem) => {
            const doc = this.simplemde.codemirror.getDoc();
            const cursor = doc.getCursor();

            const altTag = image.title ? `alt="${image.title}" ` : '';
            const replaceText = `<table><tr><td><img src="${image.name}" ${altTag}/></td></tr></table>`;
            doc.replaceRange(replaceText, cursor);
          });
      }
    };
  }

  ngAfterViewInit() {
    const config = {
      element: this.textarea.nativeElement,
      toolbar: [
        'bold', 'italic', 'heading',
        '|',
        'quote', 'unordered-list', 'ordered-list', 'code',
        '|',
        'link', 'table', 'horizontal-rule', 'image', this.createImageListToolbar(),
        '|',
        'preview', 'guide'
      ]
    };
    this.simplemde = new SimpleMDE(config);

    if (this.tmpValue) {
      const fixedValue = this.getFixedValue(this.tmpValue);
      this.simplemde.value(fixedValue);
      this.tmpValue = null;
    }

    this.simplemde.codemirror.on('change', () => {
      if (this.value === undefined && !this.simplemde.value()) {
        return;
      }

      const value = this.simplemde.value();
      const fixedValue = this.getFixedValue(value);

      if (value !== fixedValue) {
        this.simplemde.value(fixedValue);
      }

      this.value = fixedValue;
    });
  }

  private populateImages() {
    if (this.mediaReferences && this.mediaReferences.length > 0) {
      const ids = this.mediaReferences.map((mr) => mr.id);

      this.fhirService.search('Media', null, null, null, null, {_id: ids}).toPromise()
        .then((results: Bundle) => {
          this.images = (results.entry || []).map((entry) => {
            const mediaReference = this.mediaReferences.find((mr) => mr.id === entry.resource.id);
            const media = <STU3Media | R4Media> entry.resource;

            const imageItem = new ImageItem();
            imageItem.name = media.identifier && media.identifier.length > 0 ? media.identifier[0].value : 'N/A';
            imageItem.title = mediaReference.name;
            imageItem.description = mediaReference.description;
            return imageItem;
          });
        });
    } else {
      this.images = [];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.simplemde) {
      return;
    }

    if (changes['disabled'] && changes['disabled'].previousValue !== changes['disabled'].currentValue) {
      this.simplemde.codemirror.setOption('disableInput', changes['disabled'].currentValue);
    }
  }

  ngOnDestroy() {
    this.simplemde = null;
  }

  ngAfterContentChecked() {
    if (!this.isVisible && this.textarea.nativeElement.offsetParent != null) {
      this.isVisible = true;

      if (this.simplemde.codemirror) {
        this.simplemde.codemirror.refresh();
      }
    } else if (this.isVisible && this.textarea.nativeElement.offsetParent == null) {
      this.isVisible = false;
    }
  }

  ngOnInit(): void {
    this.populateImages();
  }
}
