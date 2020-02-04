import {Component, DoCheck, HostListener, Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {NgbModal, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {ElementTreeModel} from '../../../../../libs/tof-lib/src/lib/element-tree-model';
import {
  ConstraintComponent,
  DifferentialComponent,
  ElementDefinition as STU3ElementDefinition,
  StructureDefinition as STU3StructureDefinition,
  TypeRefComponent
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  ElementDefinition as R4ElementDefinition,
  ElementDefinitionConstraintComponent,
  ElementDefinitionTypeRefComponent,
  StructureDefinition as R4StructureDefinition
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {RecentItemService} from '../shared/recent-item.service';
import {FhirService} from '../shared/fhir.service';
import {FileService} from '../shared/file.service';
import {DOCUMENT} from '@angular/common';
import {ConfigService} from '../shared/config.service';
import {ElementDefinitionPanelComponent} from './element-definition-panel/element-definition-panel.component';
import {AuthService} from '../shared/auth.service';
import {BaseComponent} from '../base.component';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {IElementDefinition, IExtension} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Component({
  templateUrl: './structure-definition.component.html',
  styleUrls: ['./structure-definition.component.css']
})
export class StructureDefinitionComponent extends BaseComponent implements OnInit, OnDestroy, DoCheck {
  private readonly dataTypes = ['Ratio', 'Period', 'Range', 'Attachment', 'Identifier', 'Annotation', 'CodeableConcept', 'Coding', 'Money',
    'Timing', 'Age', 'Distance', 'Duration', 'Count', 'MoneyQuantity', 'SimpleQuantity', 'Quantity', 'SampledData', 'Signature', 'Address', 'ContactPoint', 'HumanName',
    'Reference', 'Meta', 'Dosage', 'Narrative', 'Extension', 'ElementDefinition', 'ContactDetail', 'Contributor', 'DataRequirement', 'RelatedArtifact', 'UsageContext',
    'ParameterDefinition', 'Expression', 'TriggerDefinition'];

  @Input() public structureDefinition: STU3StructureDefinition | R4StructureDefinition;
  public baseStructureDefinition;
  public elements: ElementTreeModel[] = [];
  public selectedElement: ElementTreeModel;
  public validation: any;
  public message: string;
  public sdNotFound = false;
  public Globals = Globals;
  public elementSearch: string;

  @ViewChild('edPanel', { static: true }) edPanel: ElementDefinitionPanelComponent;
  @ViewChild('sdTabs', { static: true }) sdTabs: NgbTabset;

  private navSubscription: any;

  constructor(
    public route: ActivatedRoute,
    public configService: ConfigService,
    protected authService: AuthService,
    private router: Router,
    private strucDefService: StructureDefinitionService,
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

  get notes() {
    if (!this.structureDefinition || !this.structureDefinition.extension) return '';
    const extensions: IExtension[] = this.structureDefinition.extension;
    const notes = extensions.find(e => e.url === Globals.extensionUrls['extension-sd-notes']);
    return notes ? notes.valueMarkdown || '' : '';
  }

  set notes(value: string) {
    if (!this.structureDefinition) return;
    this.structureDefinition.extension = this.structureDefinition.extension || [];
    const extensions: IExtension[] = this.structureDefinition.extension;
    let notes = extensions.find(e => e.url === Globals.extensionUrls['extension-sd-notes']);

    if (!notes && value) {
      notes = {
        url: Globals.extensionUrls['extension-sd-notes'],
        valueMarkdown: value
      };
      extensions.push(notes);
    } else if (notes && !value) {
      const index = extensions.indexOf(notes);
      extensions.splice(index, index >= 0 ? 1 : 0);
    } else if (notes && value) {
      notes.valueMarkdown = value;
    }
  }

  get intro() {
    if (!this.structureDefinition || !this.structureDefinition.extension) return '';
    const extensions: IExtension[] = this.structureDefinition.extension;
    const intro = extensions.find(e => e.url === Globals.extensionUrls['extension-sd-intro']);
    return intro ? intro.valueMarkdown || '' : '';
  }

  set intro(value: string) {
    if (!this.structureDefinition) return;
    this.structureDefinition.extension = this.structureDefinition.extension || [];
    const extensions: IExtension[] = this.structureDefinition.extension;
    let intro = extensions.find(e => e.url === Globals.extensionUrls['extension-sd-intro']);

    if (!intro && value) {
      intro = {
        url: Globals.extensionUrls['extension-sd-intro'],
        valueMarkdown: value
      };
      extensions.push(intro);
    } else if (intro && !value) {
      const index = extensions.indexOf(intro);
      extensions.splice(index, index >= 0 ? 1 : 0);
    } else if (intro && value) {
      intro.valueMarkdown = value;
    }
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

  public toggleSelectedElement(element?: ElementTreeModel, disableDeselect = false) {
    if (!element || this.selectedElement === element) {
      if (!disableDeselect) {
        this.selectedElement = null;
      }
    } else if (element) {
      this.selectedElement = element;
    }
  }

  public beforeTabChange(event: any) {
    if (event.nextId !== 'elements') {
      this.selectedElement = null;
    }
  }

  private removeElementTreeChildren(target: ElementTreeModel) {
    const filtered = this.elements.filter((element: ElementTreeModel) => {
      return element.parent === target;
    });

    for (let i = filtered.length - 1; i >= 0; i--) {
      this.removeElementTreeChildren(filtered[i]);

      const index = this.elements.indexOf(filtered[i]);
      this.elements.splice(index, 1);
    }
  }

  public toggleElementExpand(target: ElementTreeModel, event?) {
    if (!target.hasChildren) {
      return;
    }

    if (target.expanded) {
      this.removeElementTreeChildren(target);
      target.expanded = false;
    } else {
      this.populateBaseElements(target);
      target.expanded = true;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public nameChanged() {
    this.configService.setTitle(`StructureDefinition - ${this.structureDefinition.title || this.structureDefinition.name || 'no-name'}`);
  }

  public populateConstrainedElements(elementTreeModels: ElementTreeModel[]) {
    for (let i = 0; i < elementTreeModels.length; i++) {
      const elementTreeModel = elementTreeModels[i];
      const baseElementId = elementTreeModel.baseElement.id;
      const baseHasSlicing = elementTreeModel.baseElement.hasOwnProperty('slicing');

      const elements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;
      const constrainedElements = (elements || []).filter((diffElement) => {
        const diffHasSlicing = diffElement.hasOwnProperty('slicing');

        if (diffElement.id === baseElementId) {
          // Simple check for an exact match between the base element's id and the differential element's id
          return true;
        } else if (diffElement.id.startsWith(baseElementId + ':')) {
          // the element is constrained with a slice, but we need to make sure the path doesn't represent a child of the slice
          const after = diffElement.id.substring(baseElementId.length + 1);
          return after.indexOf('.') < 0;
        }

        if (elementTreeModel.basePath === diffElement.path) {
          if (elementTreeModel.parent && elementTreeModel.parent.constrainedId && diffElement.id && diffElement.id.startsWith(elementTreeModel.parent.constrainedId)) {
            return true;
          }
        }

        return elementTreeModel.path === diffElement.path;
      });

      for (let x = 0; x < constrainedElements.length; x++) {
        let newElementTreeModel = elementTreeModel;

        if (x > 0) {
          newElementTreeModel = new ElementTreeModel();
          Object.assign(newElementTreeModel, elementTreeModel);
          elementTreeModels.splice(i + x, 0, newElementTreeModel);
        }

        newElementTreeModel.constrainedElement = constrainedElements[x];
      }

      i += constrainedElements.length;
    }
  }

  public populateBaseElements(parent?: ElementTreeModel) {
    // If no parent, then asking to populate the top-level, which is only
    // performed during a refresh
    if (!parent) {
      this.elements = [];
    }
    let filtered = [];
    const baseProfile = parent ? parent.profile : this.baseStructureDefinition;
    const baseElements = baseProfile.snapshot.element || [];
    let nextIndex = parent ? this.elements.indexOf(parent) + 1 : 0;
    let parentPath = parent ? parent.profilePath || '' : '';
    //const parentSliceName = parent && parent.displayId.indexOf(':') > 0 ? parent.displayId.substring(parent.displayId.indexOf(':') + 1) : null;

    if (parent && parent.baseElement && parent.baseElement.contentReference && parent.baseElement.contentReference.startsWith('#')) {
      parentPath = parent.baseElement.contentReference.substring(1);
    }

    if (parentPath.endsWith('[x]')) {
      const types = <(TypeRefComponent | ElementDefinitionTypeRefComponent)[]> parent.baseElement.type;
      // this is a choice element, the child elements are the types of the choice
      filtered = (types || []).map((type) => {
        return {
          path: parentPath.substring(0, parentPath.lastIndexOf('[x]')) + type.code
        };
      });
    } else {
      // this is not a choice element, just need to find the children of the parent
      filtered = (baseElements || []).filter((baseElement) => {
        if (parentPath) {
          return baseElement.path.startsWith(parentPath + '.') &&
            baseElement.path.split('.').length === (parentPath.split('.').length + 1);
        } else {
          return baseElement.path === this.structureDefinition.type;
        }
      });
    }

    for (let i = 0; i < filtered.length; i++) {
      const baseElement = JSON.parse(JSON.stringify(filtered[i]));
      const position = baseElements.indexOf(filtered[i]);
      const leafProperty = filtered[i].path.indexOf('.') > 0 ?
        filtered[i].path.substring(filtered[i].path.lastIndexOf('.') + 1) :
        filtered[i].path;

      const newElement = new ElementTreeModel();
      newElement.parent = parent;
      newElement.baseElement = baseElement;
      newElement.depth = parent ? parent.depth + 1 : 1;
      newElement.position = position;

      if (filtered[i].contentReference) {
        newElement.hasChildren = true;

        // The base element's path and id most reflect the action depth of the path so that the logic to identifying
        // what constrained elements apply to this base element works.
        if (newElement.parent) {
          newElement.baseElement.path = newElement.parent.baseElement.path + '.' + newElement.displayId;
          newElement.baseElement.id = newElement.parent.baseElement.id + '.' + newElement.displayId;
        }
      } else if (newElement.type && this.dataTypes.indexOf(newElement.type) >= 0) {
        newElement.hasChildren = true;
      } else {
        newElement.hasChildren = (baseElements || []).filter((element: STU3ElementDefinition | R4ElementDefinition) => {
          return element.path.startsWith(filtered[i].path + '.') &&
            element.path.split('.').length === (filtered[i].path.split('.').length + 1);
        }).length > 0;
      }

      const isDataType = this.dataTypes.indexOf(newElement.type) >= 0;

      // Change the profile of the tree item for data types
      newElement.profile = isDataType ?
        this.fhirService.fhir.parser.structureDefinitions.find((sd) => sd.id === newElement.type) :
        baseProfile;

      newElement.path = parent ?
        parent.path + '.' + leafProperty :
        filtered[i].path;

      if (isDataType) {
        newElement.profilePath = newElement.type;
      } else if (parent) {
        newElement.profilePath = parent.profilePath + '.' + leafProperty;
      } else {
        newElement.profilePath = newElement.path;
      }

      const newElements = [newElement];
      this.populateConstrainedElements(newElements);

      for (let x = 0; x < newElements.length; x++) {
        this.elements.splice(nextIndex, 0, newElements[x]);
        nextIndex++;
      }
    }

    if (parentPath === '' && this.elements.length === 1) {
      this.toggleElementExpand(this.elements[0]);
    }
  }

  private async getStructureDefinition() {
    const sdId = this.route.snapshot.paramMap.get('id');

    this.message = 'Loading structure definition...';
    this.structureDefinition = null;
    this.elements = [];

    try {
      this.structureDefinition = await this.strucDefService.getStructureDefinition(sdId).toPromise();
    } catch (err) {
      this.sdNotFound = err.status === 404;
      this.message = getErrorString(err);
      this.recentItemService.removeRecentItem(Globals.cookieKeys.recentStructureDefinitions, sdId);
      return;
    }

    this.nameChanged();

    if (!this.structureDefinition.differential) {
      this.structureDefinition.differential = new DifferentialComponent({ element: [] });
    }

    if (this.structureDefinition.differential.element.length === 0) {
      const elements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;
      elements.push({
        id: this.structureDefinition.type,
        path: this.structureDefinition.type
      });
    }

    this.message = 'Loading base structure definition...';
    let baseStructureDefinition;

    try {
      baseStructureDefinition = await this.strucDefService.getBaseStructureDefinition(this.structureDefinition.baseDefinition, this.structureDefinition.type).toPromise();
    } catch (err) {
      this.message = getErrorString(err);
      return;
    }

    this.baseStructureDefinition = baseStructureDefinition;
    this.populateBaseElements();
    this.recentItemService.ensureRecentItem(
      Globals.cookieKeys.recentStructureDefinitions,
      this.structureDefinition.id,
      this.structureDefinition.name);
    this.message = 'Done loading structure definition';
  }

  private calculateConstraintPosition(elementTreeModel: ElementTreeModel) {
    // the element must have a parent and the parent must be constrained in order to create a child constraint
    if (!elementTreeModel.parent || !elementTreeModel.parent.constrainedElement) {
      return;
    }

    const elements = <(IElementDefinition)[]> this.structureDefinition.differential.element;
    const thisElementIndex = this.elements.indexOf(elementTreeModel);
    const previousConstrainedSiblings = this.elements.filter((e, i) => e.parent === elementTreeModel.parent && e.constrainedElement && i < thisElementIndex);

    if (previousConstrainedSiblings.length === 0) {
      // no siblings have been constrained. place this new constraint immediately following the parent
      const parentConstraint = elementTreeModel.parent.constrainedElement;
      const parentIndex = elements.indexOf(<STU3ElementDefinition> parentConstraint);
      return parentIndex + 1;
    } else {
      const previousConstrainedSibling = previousConstrainedSiblings[previousConstrainedSiblings.length - 1];
      const previousConstrainedIndex = elements.indexOf(previousConstrainedSibling.constrainedElement);
      return previousConstrainedIndex + 1;
    }
  }

  public constrainElement(elementTreeModel: ElementTreeModel, event?: any) {
    if (elementTreeModel.parent && !elementTreeModel.parent.constrainedElement) {
      this.constrainElement(elementTreeModel.parent);
    }

    const leafElementName = elementTreeModel.baseElement.id.substring(elementTreeModel.baseElement.id.lastIndexOf('.') + 1);
    const elements = <IElementDefinition[]> this.structureDefinition.differential.element;
    let constrainedElement: IElementDefinition;

    if (this.configService.isFhirSTU3) {
      constrainedElement = new STU3ElementDefinition();
    } else {
      constrainedElement = new R4ElementDefinition();
    }

    constrainedElement.id = elementTreeModel.parent ?
      `${elementTreeModel.parent.id}.${leafElementName}` :
      elementTreeModel.baseElement.path;
    constrainedElement.path = elementTreeModel.path;

    // Set the constrainedElement on the treeModel
    elementTreeModel.constrainedElement = constrainedElement;

    const newIndex = this.calculateConstraintPosition(elementTreeModel);
    elements.splice(newIndex, 0, constrainedElement);

    if (this.selectedElement !== elementTreeModel) {
      this.toggleSelectedElement(elementTreeModel);
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // In case this was executed using the keyboard, automatically focus on the element definition panel
    setTimeout(() => {
      if (this.edPanel) {
        this.edPanel.focus();
      }
    }, 100);
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

  public sliceElement(elementTreeModel: ElementTreeModel, event?) {
    // Collapse the element so the tree doesn't look screwed up when we mess with it
    if (elementTreeModel.expanded) {
      this.toggleElementExpand(elementTreeModel);
    }

    if (!elementTreeModel.constrainedElement.slicing) {
      elementTreeModel.constrainedElement.slicing = {
        rules: 'open'
      };
    }

    const newSliceName = 'slice' + (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString();
    let newElement: STU3ElementDefinition | R4ElementDefinition;
    const elements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;

    if (this.configService.isFhirSTU3) {
      newElement = new STU3ElementDefinition();
    } else {
      newElement = new R4ElementDefinition();
    }
    newElement.id = elementTreeModel.constrainedElement.id + ':' + newSliceName;
    newElement.path = elementTreeModel.constrainedElement.path;
    newElement.sliceName = newSliceName;

    const elementIndex = elements.indexOf(<STU3ElementDefinition> elementTreeModel.constrainedElement);
    elements.splice(elementIndex + 1, 0, newElement);

    const newElementTreeModel = new ElementTreeModel();
    newElementTreeModel.profile = elementTreeModel.profile;
    newElementTreeModel.path = elementTreeModel.path;
    newElementTreeModel.profilePath = elementTreeModel.profilePath;
    newElementTreeModel.baseElement = elementTreeModel.baseElement;
    newElementTreeModel.depth = elementTreeModel.depth;
    newElementTreeModel.hasChildren = elementTreeModel.hasChildren;
    newElementTreeModel.position = elementTreeModel.position;
    newElementTreeModel.constrainedElement = newElement;
    newElementTreeModel.expanded = false;

    const elementTreeModelIndex = this.elements.indexOf(elementTreeModel);

    // Include any children of the current elementTreeModel in the index
    for (let i = elementTreeModelIndex + 1; i < this.elements.length; i++) {
      const nextElementTreeModel = this.elements[i];
      if (StructureDefinitionComponent.isChildOfElement(nextElementTreeModel, elementTreeModel)) {
        nextElementTreeModel.parent = newElementTreeModel;
        // TODO: nextElementTreeModel.displayId = nextElementTreeModel.displayId + ':' + newSliceName;
        nextElementTreeModel.constrainedElement.id = nextElementTreeModel.constrainedElement.id + ':' + newSliceName;
        break;
      }
    }

    this.elements.splice(elementTreeModelIndex + 1, 0, newElementTreeModel);

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public removeElementDefinition(element: IElementDefinition, event?, shouldConfirm = true) {
    if (shouldConfirm && !confirm('Are you sure you want to remove the constraints for this element?')) {
      return;
    }

    const childElementDefinitions = this.getChildElementDefinitions(element);

    childElementDefinitions.forEach((childElementDefinition) => this.removeElementDefinition(childElementDefinition, null, false));

    const elements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;
    const elementIndex = elements.indexOf(<STU3ElementDefinition> element);
    this.structureDefinition.differential.element.splice(elementIndex, 1);

    const foundElementTreeModel = this.elements.find((elementTreeModel: ElementTreeModel) =>
      elementTreeModel.constrainedElement === element);
    const isSliceRoot = foundElementTreeModel ? foundElementTreeModel.isSliceRoot : false;

    if (foundElementTreeModel) {
      foundElementTreeModel.constrainedElement = null;
    }

    // Collapse the element tree model now that it is removed
    if (foundElementTreeModel.expanded) {
      this.toggleElementExpand(foundElementTreeModel);
    }

    // If it is a slice root, remove the element tree model entirely
    if (isSliceRoot) {
      const foundElementTreeModelIndex = this.elements.indexOf(foundElementTreeModel);
      this.elements.splice(foundElementTreeModelIndex, 1);
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private getChildElementDefinitions(element: IElementDefinition): (STU3ElementDefinition | R4ElementDefinition)[] {
    const elementId = element.id;
    const sliceName = elementId.indexOf(':') >= 0 ? elementId.substring(elementId.indexOf(':') + 1) : '';
    const elements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;

    // noinspection UnnecessaryLocalVariableJS
    const filtered = (elements || []).filter((nextElement) => {
      const isBase = nextElement.id.startsWith(elementId + '.');
      const isLeaf = nextElement.id.split('.').length === elementId.split('.').length + 1;
      const isSlice = nextElement.id.endsWith(':' + sliceName);

      // noinspection RedundantIfStatementJS
      if (!isBase || !isLeaf || (sliceName && !isSlice)) {
        return false;
      }

      return true;
    });

    return filtered;
  }

  public cardinalityAllowsMultiple(max: string) {
    return max !== '0' && max !== '1';
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the profile?')) {
      return;
    }

    // noinspection JSIgnoredPromiseFromCall
    this.getStructureDefinition();
  }

  public save() {
    if (!this.validation.valid && !confirm('This structure definition is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      return;
    }

    this.strucDefService.save(this.structureDefinition)
      .subscribe((results: STU3StructureDefinition | R4StructureDefinition) => {
        if (!this.structureDefinition.id) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.baseSessionUrl}/structure-definition/${results.id}`]);
        } else {
          this.recentItemService.ensureRecentItem(Globals.cookieKeys.recentStructureDefinitions, results.id, results.name);
          this.message = 'Your changes have been saved!';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/structure-definition/')) {
        // noinspection JSIgnoredPromiseFromCall
        this.getStructureDefinition();
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
    }
  }

  public elementSearchChanged(value: string) {
    this.elementSearch = value;
  }

  public checkForMatchingElement(element: STU3ElementDefinition | R4ElementDefinition){
    //Check the following places for a matching string: path, id,
    //constraint.requirements, binding.valueSetUri (or binding.valueset),
    //type.code, type.profile, type.targetProfile, and sliceName
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
    if(checkBinding) return true;

    if(element.type){
      let types = this.configService.isFhirSTU3 ? <TypeRefComponent[]> element.type : <ElementDefinitionTypeRefComponent[]> element.type;
      for(let i = 0; i < types.length; i++){
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

  getSearchElement(){
    const structureDefElements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.structureDefinition.differential.element;
    let found = structureDefElements.find((element) => {
      return this.checkForMatchingElement(element);
    });
    if(!found){
      const baseStructDefElements = <(STU3ElementDefinition | R4ElementDefinition)[]> this.baseStructureDefinition.snapshot.element;
      found = baseStructDefElements.find((element) => {
        return this.checkForMatchingElement(element);
      });
    }
    if(found){
      const model = this.elements.find((element) => {
        const foundPath = found.path;
        const elementPath = element.path;
        return foundPath === elementPath;
      });

      if(model){
        this.selectedElement = model;
      }
      else {
        let pathElements = found.path.split(".");
        let currentPath = "";
        let currentElement;
        for (let i = 0; i < pathElements.length; i++) {
          currentPath = currentPath == "" ? pathElements[i] : currentPath + "." + pathElements[i];
          currentElement = this.elements.find(e => {
            return e.path === currentPath;
          });
          //Expand all elements that are on the path except the last one
          if (i != pathElements.length - 1 && !currentElement.expanded) {
            this.toggleElementExpand(currentElement);
          }
        }
        this.selectedElement = currentElement;
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event) {
    if (event.ctrlKey && this.elements.length > 0) {
      const index = this.selectedElement ? this.elements.indexOf(this.selectedElement) : -1;
      let shouldFocus = false;

      // noinspection JSDeprecatedSymbols,JSDeprecatedSymbols
      if (event.keyCode === 40) {           // down
        if (!this.selectedElement) {
          this.selectedElement = this.elements[0];
          shouldFocus = true;
        } else {
          if (index < this.elements.length - 1) {
            this.selectedElement = this.elements[index + 1];
            shouldFocus = true;
          }
        }
      } else { // noinspection JSDeprecatedSymbols,JSDeprecatedSymbols
        if (event.keyCode === 38) {    // up
          if (!this.selectedElement) {
            this.selectedElement = this.elements[0];
            shouldFocus = true;
          } else if (index > 0) {
            this.selectedElement = this.elements[index - 1];
            shouldFocus = true;
          }
        } else { // noinspection JSDeprecatedSymbols,JSDeprecatedSymbols
          if (event.keyCode === 46) {    // delete
            if (this.selectedElement && this.selectedElement.constrainedElement) {
              this.removeElementDefinition(this.selectedElement.constrainedElement);
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
