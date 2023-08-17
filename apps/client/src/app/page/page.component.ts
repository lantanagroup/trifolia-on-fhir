import {Component, OnInit} from '@angular/core';
import {ImplementationGuide} from '@trifolia-fhir/r4';
import {getErrorString} from '@trifolia-fhir/tof-lib';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinct, distinctUntilChanged, map} from 'rxjs/operators';
import {IFhirResource, Page} from '@trifolia-fhir/models';
import {NonFhirResourceService} from '../shared/nonFhir-resource-.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';


enum PageType {
  Index = 0,
  Download,
  Other
}

@Component({
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})

export class PageComponent implements OnInit {
  public page: Page;
  public implementationGuide: ImplementationGuide;
  public implementationGuideId: string;
  public level: number;
  public rootPage: boolean;
  public pageNavMenus: string[];
  private navSubscription: any;
  private pageId;
  public message: string;
  public pageType: PageType = PageType.Index;
  public idChangedEvent = new Subject();
  public isIdUnique = true;
  public alreadyInUseIDMessage = '';

  constructor(public route: ActivatedRoute,
              private router: Router,
              protected nonFhirResourceService: NonFhirResourceService) {

    this.page = new Page();
    if(this.pageType == PageType.Index){
      this.page.name = "Index";
    }

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.nonFhirResourceService.checkUniqueName(this.page);
        if (!isIdUnique) {
          this.isIdUnique = false;
          this.alreadyInUseIDMessage = "ID " + this.page.id + " is already used in this IG";
        }
        else {
          this.isIdUnique = true;
          this.alreadyInUseIDMessage = "";
        }
      });

  }

  public setPage(value: Page) {
    this.page = value;
  }

  public modelChanged(event) {
    if (event == PageType.Index) {
      this.page.name = 'Index';
    } else if (event == PageType.Download) {
      this.page.name = 'Download';
      this.page.navMenu = 'Downloads';
      this.page.content = '**Full Implementation Guide**\n\nThe entire implementation guide (including the HTML files, definitions, validation information, etc.) may be downloaded [here](full-ig.zip).\n\nIn addition there are format specific definitions files.\n\n* [XML](definitions.xml.zip)\n* [JSON](definitions.json.zip)\n* [TTL](definitions.ttl.zip)\n\n**Examples:** all the examples that are used in this Implementation Guide available for download:\n\n* [XML](examples.xml.zip)\n* [JSON](examples.json.zip)\n* [TTl](examples.ttl.zip)';
    } else {
      this.page.name = '';
      this.page.navMenu = '';
      this.page.content = '';
    }
  }


  pageNavMenuSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => term.length < 2 ? [] : this.pageNavMenus.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
      distinct()
    );

  public importFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const result = e.target.result;
      this.page.content = result.substring(5 + file.type.length + 8);
    };

    reader.readAsDataURL(file);
  }


  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }


  private getPage() {

    this.implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    this.pageId = this.isNew ? null : this.route.snapshot.paramMap.get('id');

    if (!this.isNew) {
      this.page = null;

      this.nonFhirResourceService.get(this.pageId)
        .subscribe((page: Page) => {
          if (!page) {
            this.message = 'The specified Page either does not exist or was deleted';
            return;
          }
          this.page = page;
        }, (err) => {
          // this.odNotFound = err.status === 404;
          this.message = getErrorString(err);
        });
    }
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the page?')) {
      return;
    }

    this.getPage();
  }


  save() {
    // update in Db
    if (this.page.content || this.page.navMenu || this.page.reuseDescription) {
      //update/create resource
      this.nonFhirResourceService.save(this.page.id, this.page, this.implementationGuideId).subscribe({
        next: (page: Page) => {
          this.page.id = page.id;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/page/')) {
        this.getPage();
      }
    });
    this.getPage();
  }
}
