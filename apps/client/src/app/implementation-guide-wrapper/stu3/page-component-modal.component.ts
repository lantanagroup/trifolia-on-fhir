import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Extension, Binary, ImplementationGuide, PageComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {getImplementationGuideMediaReferences, MediaReference} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Observable} from 'rxjs';
import {debounceTime, distinct, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  templateUrl: './page-component-modal.component.html',
  styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
  private inputPage: PageComponent;
  public page: PageComponent;
  public implementationGuide: ImplementationGuide;
  public Globals = Globals;
  public pageNavMenus: string[];

  constructor(public activeModal: NgbActiveModal) {

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

  public getMediaReferences(): MediaReference[] {
    return getImplementationGuideMediaReferences('stu3', this.implementationGuide);
  }

  public setPage(inputPage: PageComponent) {
    this.inputPage = inputPage;

    // Make a clone of the page provided in the component's input so that
    // the modal window doesn't make changes directly to the page
    this.page = new PageComponent(this.inputPage);
  }

  public importFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const result = e.target.result;
      this.page.contentMarkdown = result.substring(5 + file.type.length + 8);
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
    const allPages: PageComponent[] = [];
    const getPages = (parent: PageComponent) => {
      allPages.push(parent);
      (parent.page || []).forEach(p => getPages(p));
    };

    if (this.implementationGuide.page) {
      getPages(this.implementationGuide.page);
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
