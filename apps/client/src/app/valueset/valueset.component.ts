import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {OperationOutcome, ValueSet} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {RecentItemService} from '../shared/recent-item.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ValueSetService} from '../shared/value-set.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../shared/fhir.service';
import {FileService} from '../shared/file.service';
import {ConfigService} from '../shared/config.service';
import {FileOpenModalComponent} from '../modals/file-open-modal/file-open-modal.component';
import {FileModel} from '../models/file-model';
import {ClientHelper} from '../clientHelper';
import {AuthService} from '../shared/auth.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {BaseComponent} from '../base.component';

@Component({
  templateUrl: './valueset.component.html',
  styleUrls: ['./valueset.component.css']
})
export class ValuesetComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  public valueSet: ValueSet;
  public message: string;
  public validation: any;
  public vsNotFound = false;
  public Globals = Globals;
  public ClientHelper = ClientHelper;

  private navSubscription: any;

  constructor(
    public route: ActivatedRoute,
    public configService: ConfigService,
    protected authService: AuthService,
    private valueSetService: ValueSetService,
    private router: Router,
    private modalService: NgbModal,
    private recentItemService: RecentItemService,
    private fileService: FileService,
    private fhirService: FhirService) {

    super(configService, authService);

    this.valueSet = new ValueSet({ meta: this.authService.getDefaultMeta() });
  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('id') === 'from-file';
  }

  public urlChanged() {
    const lastIndex = this.valueSet.url.lastIndexOf('/');

    if (lastIndex > 0 && this.isNew) {
      this.valueSet.id = this.valueSet.url.substring(lastIndex + 1);
    }
  }

  public addIncludeEntry(includeTabSet) {
    this.valueSet.compose.include.push({});
    setTimeout(() => {
      const lastIndex = this.valueSet.compose.include.length - 1;
      const newIncludeTabId = 'include-' + lastIndex.toString();
      includeTabSet.select(newIncludeTabId);
    }, 50);
  }

  public addExcludeEntry(excludeTabSet) {
    this.valueSet.compose.exclude.push({});
    setTimeout(() => {
      const lastIndex = this.valueSet.compose.exclude.length - 1;
      const newExcludeTabId = 'exclude-' + lastIndex.toString();
      excludeTabSet.select(newExcludeTabId);
    }, 50);
  }

  public enumerateFromValueSetFile() {
    if (!this.valueSet.compose) {
      return;
    }

    const modalRef = this.modalService.open(FileOpenModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.captureVersion = false;

    modalRef.result.then((file: FileModel) => {
      if (!file.resource || file.resource.resourceType !== 'ValueSet') {
        alert('The selected file must be a ValueSet resource in either XML or JSON format');
        return;
      }

      const valueSet = <ValueSet>file.resource;
      let addedCodes = 0;
      this.valueSet.compose.include = this.valueSet.compose.include || [];

      if (valueSet.expansion && valueSet.expansion.contains) {
        valueSet.expansion.contains.forEach((contains) => {
          const alreadyExists = !!(this.valueSet.compose.include || []).find((include) => {
            if (include.system !== contains.system) {
              return false;
            }

            return !!(include.concept || []).find((concept) => concept.code === contains.code);
          });

          if (!alreadyExists) {
            let foundInclude = (this.valueSet.compose.include || []).find((include) => include.system === contains.system);

            if (!foundInclude) {
              foundInclude = {
                system: contains.system,
                concept: []
              };
              this.valueSet.compose.include.push(foundInclude);
            }

            foundInclude.concept.push({
              code: contains.code,
              display: contains.display
            });
            addedCodes++;
          }
        });
      } else if (valueSet.compose && valueSet.compose.include) {
        valueSet.compose.include.forEach((sourceInclude) => {
          let foundInclude = (this.valueSet.compose.include || []).find((next) => next.system === sourceInclude.system);

          if (!foundInclude) {
            foundInclude = {
              system: sourceInclude.system,
              concept: []
            };
            this.valueSet.compose.include.push(foundInclude);
          }

          (sourceInclude.concept || []).forEach((concept) => {
            const foundConcept = (foundInclude.concept || []).find((next) => next.code === concept.code);

            if (!foundConcept) {
              foundInclude.concept.push({
                code: concept.code,
                display: concept.display
              });
              addedCodes++;
            }
          });
        });
      } else {
        alert('ValueSet does not contain a compose or include. Nothing to do.');
      }

      if (addedCodes > 0) {
        alert(`Added ${addedCodes} codes to the value set.`);
      } else {
        alert(`No codes were added to the value set`);
      }
    });
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the value set?')) {
      return;
    }

    this.getValueSet();
  }

  public save() {
    if (!this.validation.valid && !confirm('This value set is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      return;
    }

    this.valueSetService.save(this.valueSet)
      .subscribe((results: ValueSet) => {
        if (this.isNew) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.baseSessionUrl}/value-set/${results.id}`]);
        } else {
          this.recentItemService.ensureRecentItem(Globals.cookieKeys.recentValueSets, results.id, results.name);
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
        this.message = 'Your changes have been saved!';
      }, (err) => {
        this.message = `An error occurred while saving the value set: ${err.message}`;
      });
  }

  private getValueSet() {
    const valueSetId = this.route.snapshot.paramMap.get('id');

    if (this.isFile) {
      if (this.fileService.file) {
        this.valueSet = <ValueSet>this.fileService.file.resource;
        this.nameChanged();
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      this.valueSet = null;

      this.valueSetService.get(valueSetId)
        .subscribe((results: ValueSet | OperationOutcome) => {
          if (results.resourceType !== 'ValueSet') {
            this.message = 'The specified value set either does not exist or was deleted';
            return;
          }

          this.valueSet = <ValueSet>results;
          this.nameChanged();
          this.recentItemService.ensureRecentItem(
            Globals.cookieKeys.recentValueSets,
            this.valueSet.id,
            this.valueSet.name || this.valueSet.title);
        }, (err) => {
          this.vsNotFound = err.status === 404;
          this.message = getErrorString(err);
          this.recentItemService.removeRecentItem(Globals.cookieKeys.recentValueSets, valueSetId);
        });
    }
  }

  ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/value-set/')) {
        this.getValueSet();
      }
    });
    this.getValueSet();
  }

  ngOnDestroy() {
    this.navSubscription.unsubscribe();
    this.configService.setTitle(null);
  }

  nameChanged() {
    this.configService.setTitle(`ValueSet - ${this.valueSet.title || this.valueSet.name || 'no-name'}`);
  }

  ngDoCheck() {
    if (this.valueSet) {
      this.validation = this.fhirService.validate(this.valueSet);
    }
  }
}
