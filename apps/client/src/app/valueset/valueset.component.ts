import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ImplementationGuide, ValueSet } from '@trifolia-fhir/r4';
import { getErrorString, Globals } from '@trifolia-fhir/tof-lib';
import { RecentItemService } from '../shared/recent-item.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ValueSetService } from '../shared/value-set.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FhirService } from '../shared/fhir.service';
import { FileService } from '../shared/file.service';
import { ConfigService } from '../shared/config.service';
import { FileOpenModalComponent } from '../modals/file-open-modal/file-open-modal.component';
import { FileModel } from '../models/file-model';
import { ClientHelper } from '../clientHelper';
import { AuthService } from '../shared/auth.service';
import { BaseComponent } from '../base.component';
import { debounceTime } from 'rxjs/operators';
import { firstValueFrom, Subject } from 'rxjs';
import type { IFhirResource } from '@trifolia-fhir/models';
import { ImplementationGuideService } from '../shared/implementation-guide.service';
import type { IDomainResource } from '@trifolia-fhir/tof-lib';


@Component({
  templateUrl: './valueset.component.html',
  styleUrls: ['./valueset.component.css']
})
export class ValuesetComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  public conformance;
  public valueSet: ValueSet;
  public message: string;
  public validation: any;
  public vsNotFound = false;
  public Globals = Globals;
  public ClientHelper = ClientHelper;
  public valueSetId: string;
  public idChangedEvent = new Subject();
  public isIdUnique = true;
  public alreadyInUseIDMessage = '';
  public implementationGuide;

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
    private fhirService: FhirService,
    private implementationGuideService: ImplementationGuideService) {

    super(configService, authService);

    this.valueSet = new ValueSet({ meta: this.authService.getDefaultMeta() });

    this.conformance = { resource: this.valueSet, fhirVersion: <'stu3' | 'r4' | 'r5'>configService.fhirVersion, permissions: this.authService.getDefaultPermissions() };

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        const isIdUnique = await this.fhirService.checkUniqueId(this.valueSet);
        if (!isIdUnique) {
          this.isIdUnique = false;
          this.alreadyInUseIDMessage = "ID " + this.valueSet.id + " is already used in this IG.";
        }
        else {
          this.isIdUnique = true;
          this.alreadyInUseIDMessage = "";
        }
      });
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

    const modalRef = this.modalService.open(FileOpenModalComponent, { size: 'lg', backdrop: 'static' });
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

    this.valueSetService.save(this.valueSetId, this.conformance)
      .subscribe({
        next: (conf: IFhirResource) => {
          if (this.isNew) {
            // noinspection JSIgnoredPromiseFromCall
            this.valueSetId = conf.id;
            this.router.navigate([`${this.configService.baseSessionUrl}/value-set/${this.valueSetId}`]);
          } else {
            this.loadVS(conf.resource);
            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
          this.message = 'Your changes have been saved!';
        },
        error: (err) => {
          this.message = `An error occurred while saving the value set: ${err.message}`;
        }
      });
  }

  private getValueSet() {
    this.valueSetId = this.isNew ? null : this.route.snapshot.paramMap.get('id');

    if (this.isFile) {
      if (this.fileService.file) {
        this.loadVS(this.fileService.file.resource);
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      this.valueSet = null;

      this.valueSetService.getValueSet(this.valueSetId)
        .subscribe({
          next: (conf: IFhirResource) => {
            if (!conf || !conf.resource || conf.resource.resourceType !== 'ValueSet') {
              this.message = 'The specified code system either does not exist or was deleted';
              return;
            }

            this.conformance = conf;
            this.loadVS(conf.resource);
          },
          error: (err) => {
            this.vsNotFound = err.status === 404;
            this.message = getErrorString(err);
            this.recentItemService.removeRecentItem(Globals.cookieKeys.recentCodeSystems, this.valueSetId);
          }
        });
    }
  }

  public loadVS(newVal: IDomainResource) {
    this.valueSet = new ValueSet(newVal);

    if (this.conformance) {
      this.conformance.resource = this.valueSet;
    }

    this.nameChanged();
    this.recentItemService.ensureRecentItem(
      Globals.cookieKeys.recentCodeSystems,
      this.valueSetId,
      this.valueSet.name || this.valueSet.title);
  }

  async ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/value-set/')) {
        this.getValueSet();
      }
    });
    this.getValueSet();
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    this.implementationGuide = <ImplementationGuide>(await firstValueFrom(this.implementationGuideService.getImplementationGuide(implementationGuideId))).resource;

    const url = this.implementationGuide.url;
    if (!this.valueSet.url) {
      this.valueSet.url = url ? url.substr(0, url.indexOf("ImplementationGuide")) + "ValueSet/" : ""
    }
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
