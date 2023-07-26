import { Component, DoCheck, EventEmitter, Input, OnInit } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { Coding, ImplementationGuide, SearchParameter } from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import { FhirService } from '../shared/fhir.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '../base.component';
import { AuthService } from '../shared/auth.service';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import { FileService } from '../shared/file.service';
import { SearchParameterService } from '../shared/search-parameter.service';
import { RecentItemService } from '../shared/recent-item.service';
import { getErrorString } from '../../../../../libs/tof-lib/src/lib/helper';
import { firstValueFrom, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeResourceIdModalComponent } from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import { IFhirResource } from '@trifolia-fhir/models';
import { ImplementationGuideService } from '../shared/implementation-guide.service';
import { IDomainResource } from '@trifolia-fhir/tof-lib';

@Component({
  selector: 'trifolia-fhir-search-parameter',
  templateUrl: './search-parameter.component.html',
  styleUrls: ['./search-parameter.component.css']
})
export class SearchParameterComponent extends BaseComponent implements OnInit, DoCheck {
  @Input() public implementationGuide: ImplementationGuide;
  @Input() public searchParameter;
  public fhirResource;
  public idChangedEvent = new Subject();
  public isIdUnique = true;
  public alreadyInUseIDMessage = '';

  public Globals = Globals;
  public results: [] = null;
  public validation: any;
  public message: string;
  public spNotFound = false;
  public resourceTypeCodes: Coding[] = [];
  public codes: Coding[] = [];
  public messageEventCodes: Coding[] = [];
  public messageTransportCodes: Coding[] = [];
  private navSubscription: any;
  public name: string;
  public xml: string;
  public igChanging: EventEmitter<boolean> = new EventEmitter<boolean>();
  public searchParameterId;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private modal: NgbModal,
    private spService: SearchParameterService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private recentItemService: RecentItemService,
    private fhirService: FhirService,
    private implementationGuideService: ImplementationGuideService) {

    super(configService, authService);

    this.searchParameter = new SearchParameter({ meta: this.authService.getDefaultMeta() });
    this.fhirResource = { resource: this.searchParameter, fhirVersion: <'stu3' | 'r4' | 'r5'>configService.fhirVersion, permissions: this.authService.getDefaultPermissions() };

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.fhirService.checkUniqueId(this.searchParameter);
        if (!isIdUnique) {
          this.isIdUnique = false;
          this.alreadyInUseIDMessage = 'ID ' + this.searchParameter.id + ' is already used in this IG.';
        } else {
          this.isIdUnique = true;
          this.alreadyInUseIDMessage = '';
        }
      });

    this.igChanging.subscribe((value) => {
      this.isDirty = value;
      this.configService.setTitle(`SearchParameter - ${this.searchParameter.name || 'no-name'}`, this.isDirty);
    });
  }

  public nameChanged() {
    this.configService.setTitle(`SearchParameter - ${this.searchParameter.name || 'no-name'}`);
  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('id') === 'from-file';
  }

  public urlChanged() {
    const lastIndex = this.searchParameter.url.lastIndexOf('/');

    if (lastIndex > 0 && this.isNew) {
      this.searchParameter.id = this.searchParameter.url.substring(lastIndex + 1);
    }
  }

  private afterSearchParameterInit() {
    if (!this.searchParameter) {
      return;
    }

    if (!this.searchParameter.base || !this.searchParameter.base.length) {
      this.searchParameter.base = this.searchParameter.base || [];
      this.searchParameter.base.push('');
    }
  }

  public getSearchParameter() {
    this.searchParameterId = this.route.snapshot.paramMap.get('id');

    if (this.isFile) {
      if (this.fileService.file) {
        this.loadSP(this.fileService.file.resource);
      } else {
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      this.searchParameter = null;
      this.spService.get(this.searchParameterId)
        .subscribe({
          next: (conf: IFhirResource) => {
            if (!conf || !conf.resource || conf.resource.resourceType !== 'SearchParameter') {
              this.message = 'The specified code system either does not exist or was deleted';
              return;
            }

            this.fhirResource = conf;
            this.loadSP(conf.resource);
          },
          error: (err) => {
            this.spNotFound = err.status === 404;
            this.message = getErrorString(err);
            this.recentItemService.removeRecentItem(Globals.cookieKeys.recentCodeSystems, this.searchParameterId);
          }
        });

    } else {
      this.afterSearchParameterInit();
    }
  }

  addBase() {
    this.searchParameter.base = this.searchParameter.base || [];
    this.searchParameter.base.push('');
  }

  addComparator() {
    this.searchParameter.comparator = this.searchParameter.comparator || [];
    this.searchParameter.comparator.push('');
  }

  addModifier() {
    this.searchParameter.modifier = this.searchParameter.modifier || [];
    this.searchParameter.modifier.push('');
  }

  addChain() {
    this.searchParameter.chain = this.searchParameter.chain || [];
    this.searchParameter.chain.push('');
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the search parameter?')) {
      return;
    }

    this.getSearchParameter();
  }

  public save() {
    if (!this.validation.valid && !confirm('This search parameter is not valid, are you sure you want to save?')) {
      return;
    }

    this.message = '';

    if (this.isFile) {
      this.fileService.saveFile();
      return;
    }

    this.spService.save(this.searchParameterId, this.fhirResource)
      .subscribe({
        next: (conf: IFhirResource) => {
          if (this.isNew) {
            // noinspection JSIgnoredPromiseFromCall
            this.searchParameterId = conf.id;
            this.router.navigate([`${this.configService.baseSessionUrl}/search-parameter/${conf.id}`]);
          } else {
            this.fhirResource = conf;
            this.loadSP(conf.resource);
            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
          this.message = 'Your changes have been saved!';
        },
        error: (err) => {
          this.message = 'An error occurred while saving the search Parameter: ' + getErrorString(err);
        }
      });

  }


  public get wrongDateFormat() {
    if (!this.searchParameter || !this.searchParameter.date) return false;
    const dateParts = this.searchParameter.date.toString().split('-');

    return dateParts.length > 1 && (dateParts.length !== 3 || dateParts[0].length < 4 || dateParts[1].length !== 2 || dateParts[2].length !== 2);
  }

  public changeId() {
    if (!confirm('Any changes to the search parameter that are not saved will be lost. Continue?')) {
      return;
    }

    const modalRef = this.modal.open(ChangeResourceIdModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resourceType = 'SearchParameter';
    modalRef.componentInstance.originalId = this.searchParameter.id;

    modalRef.result.then(() => {
      this.igChanging.emit(true);
    });
  }


  public loadSP(newVal: IDomainResource) {

    this.searchParameter = new SearchParameter(newVal);

    if (this.fhirResource) {
      this.fhirResource.resource = newVal;
    }

    this.nameChanged();
    this.afterSearchParameterInit();
    this.recentItemService.ensureRecentItem(
      Globals.cookieKeys.recentCodeSystems,
      this.searchParameter.id,
      this.searchParameter.name);

  }

  async ngOnInit() {
    /*this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.getSearchParameters();

    // Watch the route parameters to see if the id of the implementation guide changes. Reload if it does.
    this.route.params.subscribe((params) => {
      if (params.implementationGuideId && this.implementationGuide && params.implementationGuideId !== this.implementationGuide.id) {
        this.getSearchParameters();
      }
    });*/

    this.messageTransportCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-transport');
    this.codes = this.codes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    this.messageEventCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-events');

    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    this.implementationGuide = <ImplementationGuide>(await firstValueFrom(this.implementationGuideService.getImplementationGuide(implementationGuideId))).resource;

    const url = this.implementationGuide.url;
    if (!this.searchParameter.url) {
      this.searchParameter.url = url ? url.substr(0, url.indexOf("ImplementationGuide")) + "SearchParameter/" : "";
    }
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/search-parameter/')) {
        this.getSearchParameter();
      }
    });
    this.getSearchParameter();
  }

  ngDoCheck() {
    if (this.searchParameter) {
      this.validation = this.fhirService.validate(this.searchParameter);
    }
  }

}
