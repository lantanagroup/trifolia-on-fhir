import {Component, OnInit} from '@angular/core';
import {ImplementationGuide} from '@trifolia-fhir/r4';
import {getErrorString} from '@trifolia-fhir/tof-lib';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinct, distinctUntilChanged, map} from 'rxjs/operators';
import {Page} from '@trifolia-fhir/models';
import {NonFhirResourceService} from '../shared/non-fhir-resource.service';
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
  public alreadyInUseNameMessage = '';
  public totalPages = 0;

  constructor(public route: ActivatedRoute,
              private router: Router,
              protected nonFhirResourceService: NonFhirResourceService) {

    this.page = new Page();

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.nonFhirResourceService.checkUniqueName(this.page, this.implementationGuideId);
        if (!isIdUnique) {
          this.isIdUnique = false;
          this.alreadyInUseNameMessage = 'Name ' + this.page.id + ' is already used in this IG';
        } else {
          this.isIdUnique = true;
          this.alreadyInUseNameMessage = '';
        }
        if (this.page.name == 'index') {
          this.page.reuseDescription = true;
        }
        if (this.page.name == 'download') {
          this.page.navMenu = 'Downloads';
          this.page.content = '**Full Implementation Guide**\n\nThe entire implementation guide (including the HTML files, definitions, validation information, etc.) may be downloaded [here](full-ig.zip).\n\nIn addition there are format specific definitions files.\n\n* [XML](definitions.xml.zip)\n* [JSON](definitions.json.zip)\n* [TTL](definitions.ttl.zip)\n\n**Examples:** all the examples that are used in this Implementation Guide available for download:\n\n* [XML](examples.xml.zip)\n* [JSON](examples.json.zip)\n* [TTl](examples.ttl.zip)';
        }
      });

  }

  public setPage(value: Page) {
    this.page = value;
  }

  public get reuseDescription() {
    return this.page["reuseDescription"];
  }


  public set reuseDescription(value: boolean) {
    this.page["reuseDescription"] = value;
    if(value) {
      this.page["content"] = "";
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
    return !id || id.indexOf('new') > -1;
  }


  private getPage() {

    this.implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    let id = this.route.snapshot.paramMap.get('id');

    if (id.indexOf('?totalPages=') > -1) {
      let pages = id.slice(id.indexOf('=') + 1);
      if (pages) {
        this.totalPages = parseInt(pages);
      }
      this.pageId = this.isNew ? null : id.slice(0, this.pageId.indexOf('?totalPages='));
    } else {
      this.pageId = this.isNew ? null : id;
    }

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
    } else {
      if (this.totalPages == 0) {
        this.page.name = 'index';
        this.page.reuseDescription = true;
      }
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
          this.getPage();
          setTimeout(() => {
            this.message = '';
          }, 3000);
        },
        error: (err) => {
          this.message = 'An error occurred while saving the code system: ' + getErrorString(err);
        }
      });
      this.message = 'Your changes have been saved!';
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
