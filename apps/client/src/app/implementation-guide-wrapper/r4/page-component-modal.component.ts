import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {
  Binary,
  Extension,
  ImplementationGuide,
  ImplementationGuidePageComponent
} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {getImplementationGuideMediaReferences, MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Observable} from 'rxjs';
import {debounceTime, distinct, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  templateUrl: './page-component-modal.component.html',
  styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
  private inputPage: ImplementationGuidePageComponent;
  public page: ImplementationGuidePageComponent;
  public implementationGuide: ImplementationGuide;
  public rootPage: boolean;
  public pageBinary: Binary;
  public pageNavMenus: string[];

  constructor(public activeModal: NgbActiveModal) {

  }

  public getMediaReferences(): MediaReference[] {
    return getImplementationGuideMediaReferences('r4', this.implementationGuide);
  }

  public setPage(value: ImplementationGuidePageComponent) {
    this.inputPage = value;

    // Make a clone of the page provided in the component's input so that
    // the modal window doesn't make changes directly to the page
    this.page = JSON.parse(JSON.stringify(this.inputPage));

    // Make sure the page has the required name property
    if (this.page && !this.page.nameReference && !this.page.nameUrl) {
      this.page.nameReference = { reference: '', display: '' };
    }

    if (this.page && this.page.nameReference && this.page.nameReference.reference && this.page.nameReference.reference.startsWith('#')) {
      // Find the Binary in the contained resources
      this.pageBinary = <Binary>(this.implementationGuide.contained || []).find((extension) => extension.id === this.page.nameReference.reference.substring(1));
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
      this.page.nameReference = { reference: '', display: '' };
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

  public get hasPageNavMenu(): boolean {
    const extension = (this.page.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
    return !!extension;
  }

  public set hasPageNavMenu(value: boolean) {
    let extension = (this.page.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);

    if (value && !extension) {
      this.page.extension = this.page.extension || [];
      this.page.extension.push(new Extension({ url: Globals.extensionUrls['extension-ig-page-nav-menu'], valueString: '' }));
    } else if (!value && extension) {
      const index = this.page.extension.indexOf(extension);
      this.page.extension.splice(index, 1);
    }
  }

  public get pageNavMenu(): string {
    const extension = (this.page.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);

    if (extension) {
      return extension.valueString;
    }
  }

  public set pageNavMenu(value: string) {
    let extension = (this.page.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);

    if (!extension) {
      this.page.extension = this.page.extension || [];
      extension = new Extension({ url: Globals.extensionUrls['extension-ig-page-nav-menu'] });
      this.page.extension.push(extension);
    }

    extension.valueString = value;
  }

  pageNavMenuSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.pageNavMenus.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
      distinct()
    );

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
    const allPages: ImplementationGuidePageComponent[] = [];
    const getPages = (parent: ImplementationGuidePageComponent) => {
      allPages.push(parent);
      (parent.page || []).forEach(p => getPages(p));
    };

    if (this.implementationGuide.definition && this.implementationGuide.definition.page) {
      getPages(this.implementationGuide.definition.page);
    }

    this.pageNavMenus = allPages
      .filter(p => {
        const extension = (p.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
        return !!extension;
      })
      .map(p => {
        const extension = (p.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);

        if (extension) {
          return extension.valueString;
        }
      });
  }
}
