import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Binary, ImplementationGuide, ImplementationGuidePageComponent} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {MediaReference} from '../../shared-ui/markdown/markdown.component';

@Component({
  selector: 'app-fhir-page-component-modal',
  templateUrl: './page-component-modal.component.html',
  styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
  private inputPage: ImplementationGuidePageComponent;
  public page: ImplementationGuidePageComponent;
  public implementationGuide: ImplementationGuide;
  public rootPage: boolean;
  public pageBinary: Binary;

  constructor(public activeModal: NgbActiveModal) {

  }

  public getMediaReferences(): MediaReference[] {
    if (!this.implementationGuide || !this.implementationGuide.definition) {
      return [];
    }

    return (this.implementationGuide.definition.resource || [])
      .filter((resource) => {
        return resource.reference && resource.reference.reference && resource.reference.reference.startsWith('Media/');
      })
      .map((resource) => {
        const mediaRef = new MediaReference();
        mediaRef.id = resource.reference.reference.substring('Media/'.length);
        mediaRef.name = resource.name;
        mediaRef.description = resource.description;
        return mediaRef;
      });
  }

  public setPage(value: ImplementationGuidePageComponent) {
    this.inputPage = value;

    // Make a clone of the page provided in the component's input so that
    // the modal window doesn't make changes directly to the page
    this.page = JSON.parse(JSON.stringify(this.inputPage));

    // Make sure the page has the required name property
    if (this.page && !this.page.nameReference && !this.page.nameUrl) {
      this.page.nameReference = {reference: '', display: ''};
    }

    if (this.page && this.page.nameReference && this.page.nameReference.reference && this.page.nameReference.reference.startsWith('#')) {
      // Find the Binary in the contained resources
      this.pageBinary = <Binary> (this.implementationGuide.contained || []).find((extension) => extension.id === this.page.nameReference.reference.substring(1));
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

    if (value && this.page.nameReference && this.page.nameReference.reference && this.page.nameReference.reference.startsWith('#')) {
      const foundBinary = (this.implementationGuide.contained || []).find((contained) => contained.id === this.page.nameReference.reference.substring(1));

      if (foundBinary) {
        const index = this.implementationGuide.contained.indexOf(foundBinary);
        this.implementationGuide.contained.splice(index, 1);
        delete this.page.nameReference;
        this.page.nameUrl = 'toc.md';
        this.pageBinary = null;
      }
    }
  }

  public get nameType(): string {
    if (this.page.hasOwnProperty('nameReference')) {
      return 'Reference';
    } else if (this.page.hasOwnProperty('nameUrl')) {
      return 'Url';
    }
  }

  public set nameType(value: string) {
    if (this.nameType === value) {
      return;
    }

    if (this.nameType === 'Reference') {
      delete this.page.nameReference;
      this.pageBinary = null;
      this.page.nameUrl = '';
    } else if (this.nameType === 'Url') {
      delete this.page.nameUrl;
      this.page.nameReference = {reference: '', display: ''};
    }
  }

  public get pageContent() {
    if (!this.pageBinary || !this.pageBinary.data) {
      return '';
    }

    return atob(this.pageBinary.data);
  }

  public set pageContent(value: string) {
    if (!this.pageBinary) {
      return;
    }

    this.pageBinary.data = btoa(value);
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
      newBinary.data = result.substring(5 + file.type.length + 8);
      this.implementationGuide.contained.push(newBinary);

      if (!this.page.extension) {
        this.page.extension = [];
      }

      this.nameType = 'Reference';
      this.page.nameReference.reference = '#' + newBinary.id;
      this.page.nameReference.display = 'Page content ' + newBinary.id;

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
