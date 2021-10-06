import {
  Component,
  DoCheck,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StructureDefinitionService } from '../shared/structure-definition.service';
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import { ElementTreeModel } from '../../../../../libs/tof-lib/src/lib/element-tree-model';
import {
  ConstraintComponent,
  ElementDefinition as STU3ElementDefinition,
  StructureDefinition as STU3StructureDefinition,
  TypeRefComponent
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  ElementDefinition as R4ElementDefinition,
  ElementDefinitionConstraintComponent,
  ElementDefinitionTypeRefComponent, ImplementationGuide,
  StructureDefinition as R4StructureDefinition
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import { RecentItemService } from '../shared/recent-item.service';
import { FhirService } from '../shared/fhir.service';
import { FileService } from '../shared/file.service';
import { DOCUMENT } from '@angular/common';
import { ConfigService } from '../shared/config.service';
import { ElementDefinitionPanelComponent } from './element-definition-panel/element-definition-panel.component';
import { AuthService } from '../shared/auth.service';
import { BaseComponent } from '../base.component';
import { getErrorString } from '../../../../../libs/tof-lib/src/lib/helper';
import { IElementDefinition } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { ConstraintManager } from '../../../../../libs/tof-lib/src/lib/constraint-manager';
import { BaseDefinitionResponseModel } from '../../../../../libs/tof-lib/src/lib/base-definition-response-model';
import { Severities, ValidatorResponse } from 'fhir/validator';
import {CanComponentDeactivate} from '../guards/resource.guard';
import {identifyRelease} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Versions} from 'fhir/fhir';
import {ImplementationGuideService} from '../shared/implementation-guide.service';

@Component({
  templateUrl: './structure-definition.component.html',
  styleUrls: ['./structure-definition.component.css']
})
export class StructureDefinitionComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck, CanComponentDeactivate {
  private readonly dataTypes = ['Ratio', 'Period', 'Range', 'Attachment', 'Identifier', 'Annotation', 'CodeableConcept', 'Coding', 'Money',
    'Timing', 'Age', 'Distance', 'Duration', 'Count', 'MoneyQuantity', 'SimpleQuantity', 'Quantity', 'SampledData', 'Signature', 'Address', 'ContactPoint', 'HumanName',
    'Reference', 'Meta', 'Dosage', 'Narrative', 'Extension', 'ElementDefinition', 'ContactDetail', 'Contributor', 'DataRequirement', 'RelatedArtifact', 'UsageContext',
    'ParameterDefinition', 'Expression', 'TriggerDefinition'];

  @Input() public structureDefinition: STU3StructureDefinition | R4StructureDefinition;
  public baseStructureDefinition;
  public selectedElement: ElementTreeModel;
  public validation: ValidatorResponse;
  public message: string;
  public sdNotFound = false;
  public Globals = Globals;
  public elementSearch: string;
  public constraintManager: ConstraintManager;

  @ViewChild('edPanel', { static: true }) edPanel: ElementDefinitionPanelComponent;
  @ViewChild('sdTabs', { static: true }) sdTabs: NgbTabset;

  private navSubscription: any;
  private baseDefResponse: BaseDefinitionResponseModel;

  constructor(
    public route: ActivatedRoute,
    public configService: ConfigService,
    protected authService: AuthService,
    private router: Router,
    private strucDefService: StructureDefinitionService,
    private implementationGuideService: ImplementationGuideService,
    private modalService: NgbModal,
    private recentItemService: RecentItemService,
    private fhirService: FhirService,
    private fileService: FileService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) {

    super(configService, authService);

    this.document.body.classList.add('structure-definition');
  }

  static isChildOfElement(target: ElementTreeModel, parent: ElementTreeModel): boolean {
    let current = target.parent;

    while (current) {
      if (current === parent) {
        return true;
      }

      current = current.parent;
    }

    return false;
  }

  ngOnDestroy() {
    this.document.body.classList.remove('structure-definition');
    if (this.navSubscription) {
      this.navSubscription.unsubscribe();
    }
    this.configService.setTitle(null);
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('id') === 'from-file';
  }

  public toggleMappings() {
    if (this.structureDefinition.mapping) {
      if (this.structureDefinition.mapping.length > 0) {
        const elements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;
        const foundElementsWithMappings = elements.filter(e => e.mapping && e.mapping.length > 0);

        if (foundElementsWithMappings.length > 0) {
          if (!confirm(`This will remove ${foundElementsWithMappings.length} element mappings from this profile. Are you sure you want to continue?`)) {
            return;
          }

          foundElementsWithMappings.forEach((e) => delete e.mapping);
        }

        delete this.structureDefinition.mapping;
      }
    } else {
      this.structureDefinition.mapping = [{ identity: '' }];
    }
  }

  public toggleSelectedElement(element?: ElementTreeModel, disableDeselect = false, ele = null) {
    if (!element || this.selectedElement === element) {
      if (!disableDeselect) {
        this.selectedElement = null;
      }
    } else if (element) {
      this.selectedElement = element;
    }

    if (ele) {
      setTimeout(() => {
        ele.scrollIntoView({
          block: 'center',
          inline: 'center'
        });
      }, 500);
    }
  }

  public beforeTabChange(event: any) {
    if (event.nextId !== 'elements') {
      this.selectedElement = null;
    }
  }

  public nameChanged() {
    this.configService.setTitle(`StructureDefinition - ${this.structureDefinition.title || this.structureDefinition.name || 'no-name'}`, this.isDirty);
  }

  public async loadBaseDefinition() {
    this.message = 'Loading base structure definition...';

    try {
      this.baseDefResponse = await this.strucDefService.getBaseStructureDefinition(this.structureDefinition.baseDefinition, this.structureDefinition.type).toPromise();
    } catch (err) {
      this.message = getErrorString(err);
      return;
    }

    this.baseStructureDefinition = this.baseDefResponse.base;

    if (this.configService.isFhirSTU3) {
      this.constraintManager = new ConstraintManager(STU3ElementDefinition, this.baseStructureDefinition, this.structureDefinition, this.fhirService.fhir.parser);
    } else if (this.configService.isFhirR4) {
      this.constraintManager = new ConstraintManager(R4ElementDefinition, this.baseStructureDefinition, this.structureDefinition, this.fhirService.fhir.parser);
    }

    this.constraintManager.getStructureDefinition = (url: string) => {
      return new Promise((resolve, reject) => {
        this.strucDefService.getBaseStructureDefinition(url).toPromise()
          .then(res => {
            resolve(res.base);
          })
          .catch(err => {
            reject(err);
          });
      });
    };

    await this.constraintManager.initializeRoot();

    this.message = 'Done loading base structure definition.';
  }

  private async getStructureDefinition() {
    const sdId = this.route.snapshot.paramMap.get('id');

    this.message = 'Loading structure definition...';
    this.structureDefinition = null;
    this.constraintManager = null;

    try {
      const sd = await this.strucDefService.getStructureDefinition(sdId).toPromise();

      delete sd.snapshot;

      if (identifyRelease(this.configService.fhirConformanceVersion) === Versions.R4) {
        this.structureDefinition = new R4StructureDefinition(sd);
      } else {
        this.structureDefinition = new STU3StructureDefinition(sd);
      }

      if (!this.structureDefinition.differential) {
        this.structureDefinition.differential = {
          element: []
        };
      }
    } catch (err) {
      this.sdNotFound = err.status === 404;
      this.message = getErrorString(err);
      this.recentItemService.removeRecentItem(Globals.cookieKeys.recentStructureDefinitions, sdId);
      return;
    }

    this.nameChanged();

    if (this.structureDefinition.differential.element.length === 0) {
      const elements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;
      elements.push({
        id: this.structureDefinition.type,
        path: this.structureDefinition.type
      });
    }

    await this.loadBaseDefinition();

    this.recentItemService.ensureRecentItem(
      Globals.cookieKeys.recentStructureDefinitions,
      this.structureDefinition.id,
      this.structureDefinition.name);

    if (this.route.snapshot.queryParams.copy === 'true') {
      this.message = 'Done copying structure definition';
    } else {
      this.message = 'Done loading structure definition';
    }
  }

  public hasSlices(elementTreeModel: ElementTreeModel) {
    if (!elementTreeModel.constrainedElement || !elementTreeModel.constrainedElement.slicing) {
      return;
    }

    const elements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;
    const found = (elements || []).filter((element) => {
      return element.id.indexOf(elementTreeModel.id + ':') === 0;
    });

    return found.length > 0;
  }

  public cardinalityAllowsMultiple(max: string) {
    return max !== '0' && max !== '1';
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the profile?')) {
      return;
    }

    this.isDirty = false;
    this.nameChanged();
    // noinspection JSIgnoredPromiseFromCall
    this.getStructureDefinition();
  }

  public async save() {
    if (!this.validation.valid && !confirm('This structure definition is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      this.isDirty = false;
      this.nameChanged();
      return;
    }

    await this.strucDefService.save(this.structureDefinition)
      .subscribe((updatedStructureDefinition: STU3StructureDefinition | R4StructureDefinition) => {
        if (!this.structureDefinition.id) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.baseSessionUrl}/structure-definition/${updatedStructureDefinition.id}`]);
        } else {
          this.structureDefinition.snapshot = updatedStructureDefinition.snapshot;
          this.recentItemService.ensureRecentItem(Globals.cookieKeys.recentStructureDefinitions, updatedStructureDefinition.id, updatedStructureDefinition.name);
          this.message = 'Your changes have been saved!';
          this.isDirty = false;
          this.nameChanged();
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      }, (err) => {
        this.message = getErrorString(err);
      });

    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    const implementationGuide = await this.implementationGuideService.getImplementationGuide(implementationGuideId).toPromise();
    const resources = (<ImplementationGuide> implementationGuide).definition.resource;


    const index = resources.findIndex(resource => {
      return resource.reference.reference.indexOf(this.structureDefinition.id) > 0;
    });


    if(index >= 0){
      (<ImplementationGuide> implementationGuide).definition.resource[index].name =
        this.structureDefinition.title ? this.structureDefinition.title : this.structureDefinition.name;

      await this.implementationGuideService.saveImplementationGuide(<ImplementationGuide> implementationGuide)
        .toPromise()
        .catch(err => console.log(err));
    }

  }

  ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/structure-definition/')) {
        // noinspection JSIgnoredPromiseFromCall
        this.getStructureDefinition();
        delete this.structureDefinition.snapshot;
      }
    });
    // noinspection JSIgnoredPromiseFromCall
    this.getStructureDefinition();
  }

  ngDoCheck() {
    if (this.structureDefinition) {
      this.validation = this.fhirService.validate(this.structureDefinition, {
        baseStructureDefinition: this.baseStructureDefinition
      });

      if (this.baseDefResponse && !this.baseDefResponse.success) {
        if (this.baseDefResponse.message) {
          this.validation.valid = false;
          this.validation.messages.push({
            severity: Severities.Error,
            location: 'StructureDefinition.baseDefinition',
            message: `Error getting snapshot of base definition: ${this.baseDefResponse.message}`
          });
        } else {
          this.validation.valid = false;
          this.validation.messages.push({
            severity: Severities.Error,
            location: 'StructureDefinition.baseDefinition',
            message: `Unknown error getting snapshot of base definition.`
          });
        }
      }
    }
  }

  public elementSearchChanged(value: string) {
    this.elementSearch = value;
  }

  public checkForMatchingElement(element: IElementDefinition){
    // Check the following places for a matching string: path, id,
    // constraint.requirements, binding.valueSetUri (or binding.valueset),
    // type.code, type.profile, type.targetProfile, and sliceName
    if(element.id.toLowerCase().indexOf(this.elementSearch.toLowerCase()) >= 0
      || element.path.toLowerCase().indexOf(this.elementSearch.toLowerCase()) >= 0) return true;

    let checkConstraint = false;
    if(<ConstraintComponent[]> element.constraint){
      for(let i = 0; i < element.constraint.length; i++){
        if((<ConstraintComponent> element.constraint[i]).requirements && (<ConstraintComponent> element.constraint[i]).requirements.toLowerCase().indexOf(this.elementSearch.toLowerCase()) >=0 ){
          checkConstraint = true;
          break;
        }
      }
    }
    else if(<ElementDefinitionConstraintComponent[]> element.constraint){
      for(let i = 0; i < element.constraint.length; i++){
        if((<ElementDefinitionConstraintComponent> element.constraint[i]).requirements
          && (<ElementDefinitionConstraintComponent> element.constraint[i]).requirements.toLowerCase().indexOf(this.elementSearch.toLowerCase()) >=0 ){
          checkConstraint = true;
          break;
        }
      }
    }
    if(checkConstraint) return true;

    let checkBinding = false;
    if((<STU3ElementDefinition> element).binding && (<STU3ElementDefinition> element).binding.valueSetUri){
      checkBinding = (<STU3ElementDefinition> element).binding.valueSetUri.toLowerCase().indexOf(this.elementSearch.toLowerCase()) >= 0;
    }
    else if((<R4ElementDefinition> element).binding && (<R4ElementDefinition> element).binding.valueSet){
      checkBinding = (<R4ElementDefinition> element).binding.valueSet.toLowerCase().indexOf(this.elementSearch.toLowerCase()) >= 0;
    }
    if (checkBinding) return true;

    if (element.type) {
      const types = this.configService.isFhirSTU3 ? <TypeRefComponent[]> element.type : <ElementDefinitionTypeRefComponent[]> element.type;

      for (let i = 0; i < types.length; i++) {
        if(types[i].code.toLowerCase().indexOf(this.elementSearch.toLowerCase()) >= 0){
          return true;
        }
        if(types[i].targetProfile){
          for(let j = 0; j < types[i].targetProfile.length; j++){
            if(types[i].targetProfile[j].toLowerCase().indexOf(this.elementSearch.toLowerCase()) >= 0){
              return true;
            }
          }
        }
        if(types[i].profile){
          for(let j = 0; j < types[i].profile.length; j++){
            if(types[i].profile[j].toLowerCase().indexOf(this.elementSearch.toLowerCase()) >= 0){
              return true;
            }
          }
        }
      }
    }

    if(element.sliceName && element.sliceName.toLowerCase().indexOf(this.elementSearch.toLowerCase()) >= 0){
      return true;
    }
  }

  public canDeactivate(): boolean{
    return !this.isDirty;
  }

  async getSearchElement(){
    const structureDefElements = <IElementDefinition[]> this.structureDefinition.differential.element;
    let found = structureDefElements.find((element) => {
      return this.checkForMatchingElement(element);
    });

    if (!found) {
      const baseStructDefElements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.baseStructureDefinition.snapshot.element;
      found = baseStructDefElements.find((element) => {
        return this.checkForMatchingElement(element);
      });
    } else {
      const model = this.constraintManager.elements.find((element) => {
        const foundPath = found.path;
        const elementPath = element.path;
        return foundPath === elementPath;
      });

      if (model) {
        this.selectedElement = model;
      } else {
        const pathElements = found.path.split(".");
        let currentPath = "";
        let currentElement;
        for (let i = 0; i < pathElements.length; i++) {
          currentPath = currentPath === "" ? pathElements[i] : currentPath + "." + pathElements[i];
          currentElement = this.constraintManager.elements.find(e => {
            return e.path === currentPath;
          });
          //Expand all elements that are on the path except the last one
          if (i !== pathElements.length - 1 && !currentElement.expanded) {
            await this.constraintManager.toggleExpand(currentElement);
          }
        }
        this.selectedElement = currentElement;
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event) {
    if (event.ctrlKey && this.constraintManager.elements.length > 0) {
      const index = this.selectedElement ? this.constraintManager.elements.indexOf(this.selectedElement) : -1;
      let shouldFocus = false;

      // noinspection JSDeprecatedSymbols,JSDeprecatedSymbols
      if (event.keyCode === 40) {           // down
        if (!this.selectedElement) {
          this.selectedElement = this.constraintManager.elements[0];
          shouldFocus = true;
        } else {
          if (index < this.constraintManager.elements.length - 1) {
            this.selectedElement = this.constraintManager.elements[index + 1];
            shouldFocus = true;
          }
        }
      } else { // noinspection JSDeprecatedSymbols,JSDeprecatedSymbols
        if (event.keyCode === 38) {    // up
          if (!this.selectedElement) {
            this.selectedElement = this.constraintManager.elements[0];
            shouldFocus = true;
          } else if (index > 0) {
            this.selectedElement = this.constraintManager.elements[index - 1];
            shouldFocus = true;
          }
        } else { // noinspection JSDeprecatedSymbols,JSDeprecatedSymbols
          if (event.keyCode === 46) {    // delete
            if (this.selectedElement && this.selectedElement.constrainedElement) {
              this.constraintManager.removeConstraint(this.selectedElement);
            }
          }
        }
      }

      if (shouldFocus) {
        this.sdTabs.select('elements');

        // Automatically focus on the element definition panel or the "constrain this element" button
        setTimeout(() => {
          if (this.edPanel) {
            this.edPanel.focus();
          } else {
            const edConstraintBtn = document.getElementById('edConstraintBtn');

            if (edConstraintBtn) {
              edConstraintBtn.focus();
            }
          }
        }, 100);
      }
    }
  }
}
