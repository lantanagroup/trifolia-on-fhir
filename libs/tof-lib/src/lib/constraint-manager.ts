import {IElementDefinition, IStructureDefinition} from './fhirInterfaces';
import {ParseConformance} from 'fhir/parseConformance';
import {ElementTreeModel} from './element-tree-model';

export class ConstraintManager {
  static readonly primitiveTypes = ['instant', 'time', 'date', 'dateTime', 'decimal', 'boolean', 'integer', 'string', 'uri', 'base64Binary', 'code', 'id', 'oid', 'unsignedInt', 'positiveInt'];
  readonly base: IStructureDefinition;
  readonly structureDefinition: IStructureDefinition;
  readonly fhirParser: ParseConformance;
  public elements: ElementTreeModel[];

  public constructor(base: IStructureDefinition, structureDefinition: IStructureDefinition, fhirParser: ParseConformance) {
    if (!base) throw new Error('base is required');
    if (!base.snapshot) throw new Error('base.snapshot is required');
    if (!base.snapshot.element) throw new Error('base.snapshot.element is required');
    if (base.snapshot.element.length === 0) throw new Error('base.snapshot must have at least one element');

    this.base = base;
    this.structureDefinition = structureDefinition;
    this.fhirParser = fhirParser;

    if (!this.structureDefinition.differential) {
      this.structureDefinition.differential = {
        element: []
      };
    } else if (!this.structureDefinition.differential.element) {
      this.structureDefinition.differential.element = [];
    }

    const rootElement = this.createElementTreeModel(this.base.snapshot.element[0]);
    this.elements = [rootElement];
    this.associate(this.elements);

    // Expand the first element
    this.toggleExpand(rootElement);
  }

  static findElementChildren(element: IElementDefinition, elements: IElementDefinition[]): IElementDefinition[] {
    if (!element || !element.id) return [];

    const parentIdParts = element.id.split('.');
    return elements.filter(e => {
      const idParts = e.id ? e.id.split('.') : [];
      return e.id &&
        e.id.startsWith(element.id + '.') &&
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

  createElementTreeModel(base: IElementDefinition, parent?: ElementTreeModel): ElementTreeModel {
    const etm = new ElementTreeModel();
    etm.baseElement = base;
    etm.parent = parent;
    etm.depth = parent ? parent.depth + 1 : 0;
    const children = this.findChildren(base);
    etm.hasChildren = children.length > 0;
    return etm;
  }

  toggleExpand(etm: ElementTreeModel) {
    if (!etm.expanded) {
      // Find all children of the requested element
      const children = this.findChildren(etm.baseElement, etm.constrainedElement);
      const nextIndex = this.elements.indexOf(etm) + 1;
      const newTreeModels = [];

      for (let i = children.length - 1; i >= 0; i--) {
        // Insert the element right after the element that is being expanded
        const newEtm = this.createElementTreeModel(children[i], etm);
        this.elements.splice(nextIndex, 0, newEtm);
        newTreeModels.push(newEtm);
      }

      this.associate(newTreeModels);
      etm.expanded = true;
    } else {
      const childElementTreeModels = this.elements.filter(next => next.parent === etm);
      for (let i = childElementTreeModels.length - 1; i >= 0; i--) {
        // Recursively collapse children of the child
        if (childElementTreeModels[i].expanded) {
          this.toggleExpand(childElementTreeModels[i]);
        }
        // Remove the child from the elements list
        const index = this.elements.indexOf(childElementTreeModels[i]);
        this.elements.splice(index, 1);
        etm.expanded = false;
      }
    }
  }

  findChildren(parent: IElementDefinition, constrained?: IElementDefinition): IElementDefinition[] {
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

    if (type) {
      const nextStructure = this.fhirParser.structureDefinitions.find(sd => sd.id.toLowerCase() === type.toLowerCase());

      if (nextStructure) {
        structure = <IStructureDefinition> JSON.parse(JSON.stringify(nextStructure));
        // TODO: Need to test the efficiency of this
        structure.snapshot.element.forEach(e => {
          e.id = e.id.replace(new RegExp('^' + type), parent.id);
          e.path = e.path.replace(new RegExp('^' + type), parent.path);
        });
      }
    }

    return ConstraintManager.findElementChildren(parent, structure.snapshot.element);
  }

  /**
   * Associate constraints to tree models
   * @param elementTreeModels The tree models to associate to constraints
   */
  private associate(elementTreeModels: ElementTreeModel[]) {
    for (const elementTreeModel of elementTreeModels) {
      const base = elementTreeModel.baseElement;

      for (const diff of this.structureDefinition.differential.element) {
        if (!base.path || !base.id || !diff.path || !diff.id) continue;

        const basePath = ConstraintManager.normalizePath(base.path);
        const baseId = ConstraintManager.normalizePath(base.id);
        const diffPath = ConstraintManager.normalizePath(diff.path);
        const diffId = ConstraintManager.normalizePath(diff.id);
        const pathMatch = basePath === diffPath;
        const idMatch = baseId === diffId;

        if (pathMatch && idMatch) {
          // This is a constraint on something in the base
          elementTreeModel.constrainedElement = diff;
        } else if (pathMatch && !idMatch) {
          // This is a new slice
          const index = this.elements.indexOf(elementTreeModel);
          const clone = elementTreeModel.clone(diff);
          this.elements.splice(index + 1, 0, clone);
        }
      }
    }
  }
}
