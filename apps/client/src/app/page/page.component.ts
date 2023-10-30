import {Component, OnInit} from '@angular/core';
import {ImplementationGuide, StructureDefinitionContextComponent} from '@trifolia-fhir/r4';
import {getErrorString} from '@trifolia-fhir/tof-lib';
import { Observable, Subject} from 'rxjs';
import {debounceTime, distinct, distinctUntilChanged, map} from 'rxjs/operators';
import {NonFhirResourceType, Page} from '@trifolia-fhir/models';
import {NonFhirResourceService} from '../shared/non-fhir-resource.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ConfigService} from '../shared/config.service';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';

enum PageType {
  Index = 0,
  Download,
  Other
}

@Component({
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})

export class PageComponent extends BaseComponent implements OnInit {
  public allPages : Page[] = [];
  public page: Page;
  public content;
  public pageNo = 1;
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
  public defaultName = "";
  public namePattern = '^[A-Za-z0-9_\\-]+$';
  public messagePattern = "The file name must not include spaces or special characters such as \"&\" and \"/\".";
  public contentRequired = false;

  constructor(public route: ActivatedRoute,
              private router: Router,
              public configService: ConfigService,
              protected authService: AuthService,
              protected nonFhirResourceService: NonFhirResourceService) {

    super(configService, authService);

    this.page = new Page();

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.nonFhirResourceService.checkUniqueName(this.page, this.implementationGuideId);
        if (!isIdUnique) {
          this.isIdUnique = false;
          this.alreadyInUseNameMessage = 'Name ' + this.page.name + ' is already used in this IG';
        } else {
          this.isIdUnique = true;
          this.alreadyInUseNameMessage = '';
        }
        if (this.page.name == 'index') {
          this.page.reuseDescription = true;
          this.page['content'] = "No content has been defined for this page, yet.";
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
    return this.page['reuseDescription'];
  }


  public set reuseDescription(value: boolean) {
    this.page['reuseDescription'] = value;
    if (value) {
      this.page['content'] = "No content has been defined for this page, yet.";
    }
    else{
      this.page['content'] = "";
    }
  }

  public isPageNameInvalid( ): boolean {
    const regexp: RegExp =  /[^A-Za-z0-9_\-]/;
    const matches = regexp.exec(this.page.name);
    return matches && matches.length > 0;
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

    if (id.indexOf('?defaultName=') > -1) {
      this.defaultName = id.slice(id.indexOf('=') + 1);
      this.pageId = this.isNew ? null : id.slice(0, this.pageId.indexOf('?defaultName='));
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
      this.page.name = this.defaultName;
      if (this.defaultName == 'index') {
        this.page.reuseDescription = true;
        this.page['content'] = "No content has been defined for this page, yet.";
      }
    }
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the page?')) {
      return;
    }
    this.getPage();
  }

  public saveDisabled() {
      return !this.isIdUnique ||
      !this.page.name ||
      (!this.page.content && this.contentRequired)||
      this.isPageNameInvalid() ||
      !this.canEdit(this.page)
  }


  save() {
      //update/create resource
      this.nonFhirResourceService.save(this.page.id, this.page, this.implementationGuideId).subscribe({
        next: (page: Page) => {
          if (this.isNew) {
            // noinspection JSIgnoredPromiseFromCall
            this.router.navigate([`${this.configService.baseSessionUrl}/page/${page.id}`]);
          }
          else {
            this.page.id = page.id;
            this.getPage();
            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
          this.message = 'Your changes have been saved!';
        },
        error: (err) => {
          this.message = 'An error occurred while saving the page: ' + getErrorString(err);
        }
      });
  }

  async ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/page/')) {
        this.getPage();
      }
    });

    this.getPage();

    this.nonFhirResourceService.search(this.pageNo, 'name', {"content": 0}, this.implementationGuideId, NonFhirResourceType.Page).toPromise().then((results) => {
      this.allPages = results.results;
      this.pageNavMenus = this.allPages
        .filter(p => !!p.navMenu)
        .map(p => p.navMenu)
        .reduce<string[]>((prev, curr) => {
          if (prev.indexOf(curr) < 0) prev.push(curr);
          return prev;
        }, [])
        .sort((a, b) => (a > b ? 1 : -1));
    }).catch((err) => console.log(err));

  }

}
