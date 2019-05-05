import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Binary, ImplementationGuide, PageComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  templateUrl: './page-component-modal.component.html',
  styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
  private inputPage: PageComponent;
  public page: PageComponent;
  public implementationGuide: ImplementationGuide;
  public pageBinary: Binary;
  public Globals = Globals;

  constructor(public activeModal: NgbActiveModal) {

  }

  public setPage(inputPage: PageComponent) {
    this.inputPage = inputPage;

    // Make a clone of the page provided in the component's input so that
    // the modal window doesn't make changes directly to the page
    this.page = JSON.parse(JSON.stringify(this.inputPage));

    if (this.page && this.page.source) {
      const contentExtension = (this.page.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-page-content']);

      if (contentExtension && contentExtension.valueReference && contentExtension.valueReference.reference) {
        const reference = contentExtension.valueReference.reference;

        if (reference.startsWith('#')) {
          // Find the Binary in the contained resources
          this.pageBinary = <Binary> (this.implementationGuide.contained || []).find((extension) => extension.id === reference.substring(1));
        }
      }
    }
  }

  public get autoGenerate(): boolean {
    const autoGenerateExtension = (this.page.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-page-auto-generate-toc']);

    if (autoGenerateExtension) {
      return autoGenerateExtension.valueBoolean === true;
    }

    return false;
  }

  public set autoGenerate(value: boolean) {
    if (!this.page.extension) {
      this.page.extension = [];
    }

    let autoGenerateExtension = (this.page.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-page-auto-generate-toc']);

    if (!autoGenerateExtension) {
      autoGenerateExtension = {
        url: Globals.extensionUrls['extension-ig-page-auto-generate-toc'],
        valueBoolean: false
      };
      this.page.extension.push(autoGenerateExtension);
    }

    autoGenerateExtension.valueBoolean = value;

    const foundIgPageContentExtension = (this.page.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-page-content']);

    if (value && foundIgPageContentExtension && foundIgPageContentExtension.valueReference && foundIgPageContentExtension.valueReference.reference && foundIgPageContentExtension.valueReference.reference.startsWith('#')) {
      const foundBinary = (this.implementationGuide.contained || []).find((contained) => contained.id === foundIgPageContentExtension.valueReference.reference.substring(1));

      if (foundBinary) {
        const binaryIndex = this.implementationGuide.contained.indexOf(foundBinary);
        const extensionIndex = this.page.extension.indexOf(foundIgPageContentExtension);

        this.implementationGuide.contained.splice(binaryIndex, 1);
        this.page.extension.splice(extensionIndex, 1);
        this.pageBinary = null;
      }
    }
  }

  public get pageContent() {
    if (!this.pageBinary || !this.pageBinary.content) {
      return '';
    }

    return atob(this.pageBinary.content);
  }

  public set pageContent(value: string) {
    if (!this.pageBinary) {
      return;
    }

    this.pageBinary.content = btoa(value);
  }

  public importFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const result = e.target.result;

      if (!this.implementationGuide.contained) {
        this.implementationGuide.contained = [];
      }

      const newBinary = new Binary();
      newBinary.id = Globals.generateRandomNumber(5000, 10000).toString();
      newBinary.contentType = file.type;
      newBinary.content = result.substring(5 + file.type.length + 8);
      this.implementationGuide.contained.push(newBinary);

      if (!this.page.extension) {
        this.page.extension = [];
      }

      let contentExtension = (this.page.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-page-content']);

      if (!contentExtension) {
        contentExtension = {
          url: Globals.extensionUrls['extension-ig-page-content'],
          valueReference: {
            reference: '#' + newBinary.id,
            display: 'Page content ' + newBinary.id
          }
        };
        this.page.extension.push(contentExtension);
      } else {
        contentExtension.valueReference = {
          reference: '#' + newBinary.id,
          display: 'Page content ' + newBinary.id
        };
      }

      this.pageBinary = newBinary;
    };

    reader.readAsDataURL(file);
  }

  ok() {
    if (this.inputPage) {
      // Update the properties of the input page with the changes from the cloned version
      Object.assign(this.inputPage, this.page);
    }

    this.activeModal.close();
  }

  ngOnInit() {
  }
}
