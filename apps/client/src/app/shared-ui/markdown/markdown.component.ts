import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import * as simplemde from 'simplemde-antd/dist/simplemde.min';
import {SimplemdeComponent} from 'ngx-simplemde';
import {ModalService} from '../../shared/modal.service';

/**
 * This class include generic markdown functionality for all markdown fields in Trifolia-on-FHIR. The fhir-edit-markdown component
 * provides more fhir-specific functionality for markdown.
 * See this [stackoverflow](https://stackoverflow.com/questions/60729394/ngbmodal-opens-very-slowly-for-some-modal-windows) article for information on
 * why a hidden button was created in the html template that is triggered programmatically by the custom toolbar item.
 */
@Component({
  selector: 'trifolia-fhir-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css']
})
export class MarkdownComponent implements OnInit {
  @Input() value: string;
  @Output() valueChange = new EventEmitter();
  @Input() disabled = false;
  @Input() imageListButtonTitle = 'Insert image from pre-defined list';
  @Input() mediaReferences?: MediaReference[];

  @ViewChild('smde', { static: true })
  private simplemde: SimplemdeComponent;
  @ViewChild('buttonElement', { static: true })
  private buttonEle: ElementRef;

  toolbar: any[];

  get bindValue() {
    return this.value;
  }

  set bindValue(value: string) {
    const changed = this.value !== value;
    this.value = value;

    if (changed) this.valueChange.emit(value);
  }

  get hasWhitespace() {
    return this.value && this.value !== this.value.trim();
  }

  constructor(private modalService: ModalService) {
    this.toolbar = [
      {
        name: 'bold',
        action: simplemde.toggleBold,
        className: 'smdi smdi-bold',
        title: 'Bold',
        default: true
      },
      {
        name: 'italic',
        action: simplemde.toggleItalic,
        className: 'smdi smdi-italic',
        title: 'Italic',
        default: true
      },
      {
        name: 'strikethrough',
        action: simplemde.toggleStrikethrough,
        className: 'smdi smdi-strikethrough',
        title: 'Strike-through',
        default: true
      },
      {
        name: 'heading',
        action: simplemde.toggleHeadingSmaller,
        className: 'smdi smdi-header',
        title: 'Heading',
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
        name: 'code',
        action: simplemde.toggleCodeBlock,
        className: 'smdi smdi-code',
        title: 'Code block',
        default: true
      },
      {
        name: 'quote',
        action: simplemde.toggleBlockquote,
        className: 'smdi smdi-quote-left',
        title: 'Quote',
        default: true
      },
      {
        name: 'unordered-list',
        action: simplemde.toggleUnorderedList,
        className: 'smdi smdi-list-ul',
        title: 'Unordered list',
        default: true
      },
      {
        name: 'ordered-list',
        action: simplemde.toggleOrderedList,
        className: 'smdi smdi-list-ol',
        title: 'Ordered list',
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
        name: 'link',
        action: simplemde.drawLink,
        className: 'smdi smdi-link',
        title: 'Link',
        default: true
      },
      {
        name: 'image',
        action: simplemde.drawImage,
        className: 'smdi smdi-image',
        title: 'Image',
        default: true
      },
      this.createImageListToolbar(),
      {
        name: 'table',
        action: simplemde.drawTable,
        className: 'smdi smdi-table',
        title: 'Table',
        default: true
      },
      {
        name: 'horizontal-rule',
        action: simplemde.drawHorizontalRule,
        className: 'smdi smdi-line',
        title: 'Horizontal rule',
        default: true
      },
      '|',
      {
        name: 'preview',
        action: simplemde.togglePreview,
        className: 'smdi smdi-eye no-disable',
        title: 'Preview',
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
        name: 'undo',
        action: simplemde.undo,
        className: 'smdi smdi-undo no-disable',
        title: 'Undo',
        default: true
      },
      {
        name: 'redo',
        action: simplemde.redo,
        className: 'smdi smdi-redo no-disable',
        title: 'Redo',
        default: true
      },
      '|',
      {
        name: 'guide',
        action: location.origin + '/help/MarkdownSyntax.html',
        className: 'smdi smdi-question',
        title: 'Markdown Guide',
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
      action: async () => {
        this.buttonEle.nativeElement.click();
      }
    };
  }

  async insertImage() {
    const image = await this.modalService.getMediaSelection(this.mediaReferences);

    const doc = this.simplemde.Instance.codemirror.getDoc();
    const cursor = doc.getCursor();

    const altTag = image.title ? `alt="${image.title}" ` : '';
    const replaceText = `<table><tr><td><img src="${image.name}" ${altTag}/></td></tr></table>`;
    doc.replaceRange(replaceText, cursor);
  }

  ngOnInit() {

  }
}
