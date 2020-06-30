import { IElementDefinition, IStructureDefinition } from './fhirInterfaces';
import { ParseConformance } from 'fhir/parseConformance';
import { ElementTreeModel } from './element-tree-model';

export class ConstraintManager {
  static readonly primitiveTypes = ['instant', 'time', 'date', 'dateTime', 'decimal', 'boolean', 'integer', 'string', 'uri', 'base64Binary', 'code', 'id', 'oid', 'unsignedInt', 'positiveInt'];
  readonly base: IStructureDefinition;
  readonly structureDefinition: IStructureDefinition;
  readonly fhirParser: ParseConformance;
  public elements: ElementTreeModel[];
  private readonly elementDefinitionType: (new(obj?: any) => IElementDefinition);
  public getStructureDefinition: (url: string) => Promise<IStructureDefinition>;
  private expandedStructure: IElementDefinition = null;

  /**
   *
   * @param elementDefinitionType The class/type of IElementDefinition that should be used to create
   * @param base The base structure definition
   * @param structureDefinition The child structure definition (the SD that is actively being created)
   * @param fhirParser An instance of the FHIR.js ParseConformance class that contains the core FHIR spec structures needed
   */
  public constructor(elementDefinitionType: (new(obj?: any) => IElementDefinition), base: IStructureDefinition, structureDefinition: IStructureDefinition, fhirParser: ParseConformance) {
    if (!base) throw new Error('base is required');
    if (!base.snapshot) throw new Error('base.snapshot is required');
    if (!base.snapshot.element) throw new Error('base.snapshot.element is required');
    if (base.snapshot.element.length === 0) throw new Error('base.snapshot must have at least one element');

    this.base = base;
    this.structureDefinition = structureDefinition;
    this.fhirParser = fhirParser;
    this.elementDefinitionType = elementDefinitionType;

    if (!this.structureDefinition.differential) {
      this.structureDefinition.differential = {
        element: []
      };
    } else if (!this.structureDefinition.differential.element) {
      this.structureDefinition.differential.element = [];
    }

    this.structureDefinition.differential.element = this.structureDefinition.differential.element.map(e => new elementDefinitionType(e));
  }

  async initializeRoot() {
    const rootElement = await this.createElementTreeModel(this.base.snapshot.element[0]);
    this.elements = [rootElement];
    this.associate(this.elements);

    // Expand the first element
    await this.toggleExpand(rootElement);
  }

  static findElementChildren(parentPath: string, elements: IElementDefinition[]): IElementDefinition[] {
    if (!parentPath) return [];

    const parentIdParts = parentPath.split('.');
    return elements.filter(e => {
      const idParts = e.id ? e.id.split('.') : [];
      return e.id &&
        e.id.startsWith(parentPath + '.') &&
        idParts.length === parentIdParts.length + 1;
    });
  }

  static get pathNormalizer() {
    return /(subject|timing|product|onset|value|collected|time|scheduled|occurrence|diagnosis|procedure|location|serviced|effective|content|target|source|abatement|topic|entity|legallyBinding|allowed|used|identified|manufacturer|code|definition|participantEffective|born|age|deceased|start|detail|due|module|doseNumber|seriesDoses|example|name|chargeItem|created|item|medication|rate|statusReason|indication|characteristic|reported|date|event|multipleBirth|offset|performed|occurred|answer|studyEffective|probability|when|quantity|asNeeded|fastingStatus|additive|minimumVolume|defaultValue|substance|amount|definingSubstance)(Instant|Time|Date|Datetime|Decimal|Boolean|Integer|String|Uri|Base64Binary|Code|Id|Oid|Unsignedint|Positiveint|Markdown|Element|Identifier|Humanname|Address|Contactpoint|Timing|Quantity|Simplequantity|Attachment|Range|Period|Ratio|Codeableconcept|Coding|Sampleddata|Age|Distance|Duration|Count|Money|Annotation|Signature)/gm;
  }

  static normalizePath(value: string) {
    if (value) {
      return value.replace(ConstraintManager.pathNormalizer, '$1[x]');
    }

    return value;
  }

  async createElementTreeModel(base: IElementDefinition, parent?: ElementTreeModel): Promise<ElementTreeModel> {
    const etm = new ElementTreeModel();
    etm.baseElement = base;
    etm.parent = parent;
    etm.depth = parent ? parent.depth + 1 : 0;
    const children = await this.findChildren(base);
    etm.hasChildren = children.length > 0;

    // If no child elements are defined in *this* profile, but the element references another single profile, assume the referenced profile has elements
    if (!etm.hasChildren && etm.baseElement && etm.baseElement.type && etm.baseElement.type.length === 1 && etm.baseElement.type[0].code) {
      etm.hasChildren = true;
    }

    return etm;
  }

  /**
   * This method is called when a user clicks on the + to expand structure. The expandedStructure attribute
   * is set to keep track of the structure that was expanded. This is needed to avoid calling redundant method calls
   * @param etm
   */
  async toggleExpand(etm: ElementTreeModel) {
    if (!etm.expanded) {
      this.expandedStructure = etm.baseElement;
      // Find all children of the requested element
      const children = await this.findChildren(etm.baseElement, etm.constrainedElement);
      const nextIndex = this.elements.indexOf(etm) + 1;
      const newTreeModels = [];

      for (let i = children.length - 1; i >= 0; i--) {
        // Insert the element right after the element that is being expanded
        const newEtm = await this.createElementTreeModel(children[i], etm);
        this.elements.splice(nextIndex, 0, newEtm);
        newTreeModels.push(newEtm);
      }

      this.associate(newTreeModels);
      etm.expanded = true;
    } else {
      this.expandedStructure = null;
      const childElementTreeModels = this.elements.filter(next => next.parent === etm);
      for (let i = childElementTreeModels.length - 1; i >= 0; i--) {
        // Recursively collapse children of the child
        if (childElementTreeModels[i].expanded) {
          await this.toggleExpand(childElementTreeModels[i]);
        }
        // Remove the child from the elements list
        const index = this.elements.indexOf(childElementTreeModels[i]);
        this.elements.splice(index, 1);
        etm.expanded = false;
      }
    }
  }

  async findChildren(parent: IElementDefinition, constrained?: IElementDefinition): Promise<IElementDefinition[]> {
    let structure = this.base;
    let type = parent.type && parent.type.length === 1 ? parent.type[0].code : undefined;

    if (constrained) {
      // If the constrained element defines a single type
      if (constrained.type && constrained.type.length === 1 && constrained.type[0].code) {
        type = constrained.type[0].code;
      } else {
        // If the constrained element uses an id/path notation that indicates a single type (ex: Observation.valueQuantity)
        const idSplit = constrained.id.split('.');
        const matched = ConstraintManager.pathNormalizer.exec(idSplit[idSplit.length - 1]);

        if (matched) {
          type = matched[2];
        }
      }
    }

    if (type && type !== 'BackboneElement') {
      let nextStructure = this.fhirParser.structureDefinitions.find(sd => sd.id.toLowerCase() === type.toLowerCase());

      if (!nextStructure && type.startsWith('http://') || type.startsWith('https://')) {
        if (this.expandedStructure.id === parent.id) {
          nextStructure = await this.getStructureDefinition(type);
        }
      }

      if (nextStructure) {
        structure = <IStructureDefinition> JSON.parse(JSON.stringify(nextStructure));
        // TODO: Need to test the efficiency of this
        structure.snapshot.element.forEach(e => {
          e.id = e.id.replace(new RegExp('^' + type), parent.id);
          e.path = e.path.replace(new RegExp('^' + type), parent.path);
        });
      }
    }

    const nextChildren = ConstraintManager.findElementChildren(structure !== this.base ? structure.snapshot.element[0].id : parent.id, structure.snapshot.element);
    return nextChildren;
  }

  private findPreviousSiblings(elementTreeModel: ElementTreeModel) {
    const elements = elementTreeModel.parent ? this.elements.filter(e => e.parent === elementTreeModel.parent) : this.elements.filter(e => !e.parent);
    const thisIndex = elements.indexOf(elementTreeModel);
    return elements.filter((e, i) => i < thisIndex);
  }

  removeConstraint(elementTreeModel: ElementTreeModel) {
    if (!elementTreeModel.constrainedElement) return;
    if (elementTreeModel.expanded) this.toggleExpand(elementTreeModel);

    const hasSlicing = elementTreeModel.constrainedElement.slicing;
    const removeEtm = !!elementTreeModel.constrainedElement.sliceName;
    const index = this.structureDefinition.differential.element.indexOf(elementTreeModel.constrainedElement);
    const toRemove = [elementTreeModel.constrainedElement];

    for (let i = index + 1; i < this.structureDefinition.differential.element.length; i++) {
      const next = this.structureDefinition.differential.element[i];
      const nextId = next.id ? ConstraintManager.normalizePath(next.id) : '';
      const constrainedId = ConstraintManager.normalizePath(elementTreeModel.constrainedElement.id);

      if (hasSlicing && nextId.startsWith(constrainedId + ':')) {
        toRemove.push(next);
      } else if (!hasSlicing && nextId.startsWith(constrainedId + '.')) {
        toRemove.push(next);
      } else {
        break;
      }
    }

    const diffElements = this.structureDefinition.differential.element;

    // Remove each of the constrained elements
    // If the element request to remove is a "slicing" element, it may have slices associated with it.
    // Those slices are in separate ElementTreeModel instances that also need to be removed
    for (let i = toRemove.length - 1; i >= 0; i--) {
      const elementToRemove = toRemove[i];
      const foundEtm = this.elements.find(next => next.constrainedElement === elementToRemove);

      if (foundEtm && foundEtm !== elementTreeModel) {
        this.removeConstraint(foundEtm);
      }

      const elementToRemoveIndex = diffElements.indexOf(elementToRemove);
      diffElements.splice(elementToRemoveIndex, elementToRemoveIndex >= 0 ? 1 : 0);
    }

    delete elementTreeModel.constrainedElement;

    // Remove the element from the tree model if it is a slice
    if (removeEtm) {
      const etmIndex = this.elements.indexOf(elementTreeModel);
      this.elements.splice(etmIndex, etmIndex >= 0 ? 1 : 0);
    }
  }

  slice(elementTreeModel: ElementTreeModel, sliceName?: string) {
    if (!elementTreeModel.constrainedElement) return;
    if (!elementTreeModel.max || (elementTreeModel.max !== '*' && parseInt(elementTreeModel.max, 10) <= 1)) return;

    if (!elementTreeModel.constrainedElement.slicing) {
      elementTreeModel.constrainedElement.slicing = {
        rules: 'open'
      };
    }

    // Create a new element for the slice with
    const constrainedElement = new this.elementDefinitionType();
    const clone = elementTreeModel.clone(constrainedElement);
    constrainedElement.sliceName = sliceName || 'slice' + (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString();
    constrainedElement.id = elementTreeModel.id + ':' + constrainedElement.sliceName;
    constrainedElement.path = elementTreeModel.path;

    // Determine where to store insert the new ElementDefinition in the differential
    let lastSiblingIndex = this.structureDefinition.differential.element.indexOf(elementTreeModel.constrainedElement) + 1;
    while (lastSiblingIndex < this.structureDefinition.differential.element.length) {
      const nextElement = this.structureDefinition.differential.element[lastSiblingIndex];

      if (!nextElement.id.startsWith(elementTreeModel.id + ':')) {
        break;
      }

      lastSiblingIndex++;
    }

    this.structureDefinition.differential.element.splice(lastSiblingIndex, 0, constrainedElement);

    // Determine where to put the ElementTreeModel
    lastSiblingIndex = this.elements.indexOf(elementTreeModel) + 1;
    while (lastSiblingIndex < this.elements.length) {
      const nextElement = this.elements[lastSiblingIndex];

      if (!nextElement.id.startsWith(elementTreeModel.id)) {
        break;
      }

      lastSiblingIndex++;
    }

    this.elements.splice(lastSiblingIndex, 0, clone);
  }

  /**
   * Creates a new constraint on the specified element tree model. Inserts the new ElementDefinition (constraint)
   * in the differential in the appropriate location.
   * @param elementTreeModel The element tree model that should have a new constraint
   */
  constrain(elementTreeModel: ElementTreeModel) {
    if (elementTreeModel.constrainedElement) return;

    // Create a new instance of the ELementDefinition
    elementTreeModel.constrainedElement = new this.elementDefinitionType({
      id: elementTreeModel.id,
      path: elementTreeModel.path
    });

    let prevConstrainedElementTreeModel: ElementTreeModel;
    let nextElementTreeModel = elementTreeModel;

    while (!prevConstrainedElementTreeModel && nextElementTreeModel) {
      const previousSiblings = this.findPreviousSiblings(nextElementTreeModel);
      const previousConstraints = previousSiblings.filter(e => e.constrainedElement);

      if (previousConstraints.length === 0 && nextElementTreeModel.parent && nextElementTreeModel.parent.constrainedElement) {
        prevConstrainedElementTreeModel = nextElementTreeModel.parent;
        break;
      } else if (previousConstraints.length === 0) {
        nextElementTreeModel = nextElementTreeModel.parent;
      } else {
        prevConstrainedElementTreeModel = previousConstraints[previousConstraints.length - 1];
        break;
      }
    }

    const previousConstraintIndex = this.structureDefinition.differential.element.indexOf(prevConstrainedElementTreeModel.constrainedElement);
    this.structureDefinition.differential.element.splice(previousConstraintIndex + 1, 0, elementTreeModel.constrainedElement);
  }

  /**
   * Associate constraints to tree models
   * @param elementTreeModels The tree models to associate to constraints
   */
  private associate(elementTreeModels: ElementTreeModel[]) {
    for (const elementTreeModel of elementTreeModels) {
      const base = elementTreeModel.baseElement;
      const sliceCounts: { [ path: string ]: number } = {};

      for (const diff of this.structureDefinition.differential.element) {
        if (!base.path || !base.id || !diff.path || !diff.id) continue;

        const baseId = ConstraintManager.normalizePath(elementTreeModel.id);
        const diffId = ConstraintManager.normalizePath(diff.id);
        const idMatch = baseId === diffId;
        const baseIdDepth = baseId.split('.').length;
        const diffIdDepth = diffId.split('.').length;

        if (idMatch) {
          // This is a constraint on something in the base
          elementTreeModel.constrainedElement = diff;
        } else if (diffId.startsWith(baseId + ':') && diffIdDepth === baseIdDepth) {
          // This is a new slice
          const index = this.elements.indexOf(elementTreeModel);
          const clone = elementTreeModel.clone(diff);
          sliceCounts[elementTreeModel.basePath] = (sliceCounts[elementTreeModel.basePath] || 0) + 1;
          this.elements.splice(index + sliceCounts[elementTreeModel.basePath], 0, clone);
        }
      }
    }
  }
}
