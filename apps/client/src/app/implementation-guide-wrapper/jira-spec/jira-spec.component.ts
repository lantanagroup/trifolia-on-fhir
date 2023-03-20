import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IDocumentReference, IImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {debounceTime} from 'rxjs/operators';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {generateId, getJiraSpecValue, setJiraSpecValue} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {js2xml, xml2js} from 'xml-js';
import * as vkbeautify from 'vkbeautify';
import {ConfigService} from '../../shared/config.service';
import {ImplementationGuide as R5ImplementationGuide, ImplementationGuideDefinitionPage} from '../../../../../../libs/tof-lib/src/lib/r5/fhir';
import {ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide, PageComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {saveAs} from 'file-saver';
import {parseReference} from '../../../../../../libs/tof-lib/src/lib/helper';

class JiraSpecDef {
  name: string;
  key: string;
  id?: string;
}

@Component({
  selector: 'trifolia-fhir-jira-spec',
  templateUrl: './jira-spec.component.html',
  styleUrls: ['./jira-spec.component.css']
})
export class JiraSpecComponent implements OnInit, OnChanges {
  @Input() implementationGuide: IImplementationGuide;
  @Output() change = new EventEmitter<string>();
  public valueChanged = new EventEmitter();
  public value: string;

  constructor(private configSerivce: ConfigService) {
    this.valueChanged
      .subscribe(() => {
        this.updateJiraSpecValue();
        this.change.emit(this.value);
      });
  }

  private static getKey(fileName: string) {
    if (!fileName) return 'unknown';

    let ret = fileName.trim();

    if (ret.lastIndexOf('.') > 0) {
      ret = ret.substring(0, ret.lastIndexOf('.'));
    }

    return ret
      .replace(/ /g, '_')
      .replace(/[^0-9a-zA-Z_]+/, '')
      .toLowerCase();
  }

  private getSTU3Artifacts(): JiraSpecDef[] {
    const ig = <STU3ImplementationGuide> this.implementationGuide;
    const artifacts: JiraSpecDef[] = [];

    (ig.package || []).forEach(pkg => {
      const nextArtifacts = (pkg.resource || [])
        .filter(resource => {
          if (!resource.sourceReference || !resource.sourceReference.reference) return false;
          const parsedSourceRef = parseReference(resource.sourceReference.reference);
          const isMediaForIG = parsedSourceRef.resourceType === 'Media' && !resource.example && !resource.exampleFor;
          return !isMediaForIG;
        })
        .map(resource => {
          const parsedSourceRef = parseReference(resource.sourceReference.reference);
          return <JiraSpecDef> {
            name: resource.name,
            key: `${parsedSourceRef.resourceType}-${parsedSourceRef.id}`,
            id: `${parsedSourceRef.resourceType}/${parsedSourceRef.id}`
          };
        });

      artifacts.push(... nextArtifacts);
    });

    return artifacts;
  }

  private getR4andR5Artifacts(): JiraSpecDef[] {
    const ig = <R4ImplementationGuide|R5ImplementationGuide> this.implementationGuide;

    if (!ig || !ig.definition) return [];

    const jiraSpecDefs = [];

    for (const resource of ig.definition.resource) {
      if (!resource.reference || !resource.reference.reference) continue;
      const parsedRef = parseReference(resource.reference.reference);
      const isMediaForIG = parsedRef.resourceType === 'Media' && !resource.exampleBoolean && !resource.exampleCanonical;
      if (!!isMediaForIG) continue;
      const jiraSpecDef: JiraSpecDef = {
        name: resource.name,
        key: `${parsedRef.resourceType}-${parsedRef.id}`,
        id: `${parsedRef.resourceType}/${parsedRef.id}`
      };
      jiraSpecDefs.push(jiraSpecDef);
    }

    return jiraSpecDefs;
  }

  private getSTU3Pages(): JiraSpecDef[] {
    const pageDefs: JiraSpecDef[] = [];
    const stu3IG = <STU3ImplementationGuide> this.implementationGuide;

    const nextPage = (page: PageComponent) => {
      pageDefs.push({
        name: page.title,
        key: JiraSpecComponent.getKey(page.source)
      });

      (page.page || []).forEach(p => nextPage(p));
    };

    if (stu3IG.page) {
      pageDefs.push({
        name: stu3IG.page.title,
        key: 'index'
      });

      (stu3IG.page.page || [])
        .filter(p => !!p.source)
        .forEach(p => nextPage(p));
    }

    return pageDefs;
  }

  private getR4andR5Pages(): JiraSpecDef[] {
    const pageDefs: JiraSpecDef[] = [];
    const ig = <R4ImplementationGuide | R5ImplementationGuide> this.implementationGuide;

    const nextPage = (page: ImplementationGuidePageComponent | ImplementationGuideDefinitionPage) => {
      pageDefs.push({
        name: page.title,
        key: JiraSpecComponent.getKey(page.fileName)
      });

      (page.page || []).forEach(p => nextPage(p));
    };

    if (ig.definition && ig.definition.page) {
      pageDefs.push({
        name: ig.definition.page.title,
        key: 'index'
      });

      for (const p of ig.definition.page.page || []) {
        const page = this.configSerivce.isFhirR4 ? new ImplementationGuidePageComponent(p) : new ImplementationGuideDefinitionPage(p);
        if (!page.fileName) continue;
        nextPage(page);
      }
    }

    return pageDefs;
  }

  public generateJiraSpec() {
    let jiraSpec;

    if (this.value) {
      try {
        jiraSpec = xml2js(this.value);
      } catch (ex) {
        console.log('Error parsing jira-spec value: ' + ex.message);
      }
    }

    if (!jiraSpec) {
      jiraSpec = {
        "declaration": {
          "attributes": {
            "version": "1.0",
            "encoding": "UTF-8"
          }
        },
        "elements": [
          {
            "type": "element",
            "name": "specification",
            "attributes": {
              "ballotUrl": "http://hl7.org/fhir/realm/foo/version",
              "gitUrl": "https://github.com/HL7/foo",
              "url": "http://hl7.org/fhir/foo",
              "ciUrl": "http://build.fhir.org/ig/HL7/foo",
              "defaultWorkgroup": "fhir-i",
              "defaultVersion": "1.0.0",
              "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
              "xsi:noNamespaceSchemaLocation": "../schemas/specification.xsd"
            },
            "elements": [
              {
                "type": "element",
                "name": "version",
                "attributes": {
                  "code": this.implementationGuide.version || '1.0.0'
                }
              },
              {
                "type": "element",
                "name": "artifactPageExtension",
                "attributes": {
                  "value": "-definitions"
                }
              },
              {
                "type": "element",
                "name": "artifactPageExtension",
                "attributes": {
                  "value": "-examples"
                }
              },
              {
                "type": "element",
                "name": "artifactPageExtension",
                "attributes": {
                  "value": "-mappings"
                }
              }
            ]
          }
        ]
      };
    }

    let jiraSpecArtifacts: JiraSpecDef[];
    let jiraSpecPages: JiraSpecDef[];

    if (this.configSerivce.isFhirR5) {
      jiraSpecArtifacts = this.getR4andR5Artifacts();
      jiraSpecPages = this.getR4andR5Pages();
    } if (this.configSerivce.isFhirR4) {
      jiraSpecArtifacts = this.getR4andR5Artifacts();
      jiraSpecPages = this.getR4andR5Pages();
    } else if (this.configSerivce.isFhirSTU3) {
      jiraSpecArtifacts = this.getSTU3Artifacts();
      jiraSpecPages = this.getSTU3Pages();
    } else {
      throw new Error('Unexpected FHIR server version!');
    }

    // Artifacts
    jiraSpecArtifacts.forEach(jsp => {
      let foundArtifact = jiraSpec.elements[0].elements.find(e => e.name === 'artifact' && e.attributes && e.attributes.key === jsp.key);

      if (foundArtifact) {
        foundArtifact.attributes.name = jsp.name;
      } else {
        foundArtifact = {
          type: 'element',
          name: 'artifact',
          attributes: {
            name: jsp.name,
            key: jsp.key,
            id: jsp.id
          }
        };
        jiraSpec.elements[0].elements.push(foundArtifact);
      }
    });

    jiraSpec.elements[0].elements
      .filter(e => e.type === 'element' && e.name === 'artifact' && e.attributes && e.attributes.name && e.attributes.key)
      .forEach(e => {
        const foundArtifact = jiraSpecArtifacts.find(jsp => jsp.key === e.attributes.key);

        if (!foundArtifact) {
          e.attributes.deprecated = true;
        }
      });

    // Pages
    jiraSpecPages.forEach(jsp => {
      let foundPage = jiraSpec.elements[0].elements.find(e => e.name === 'page' && e.attributes && e.attributes.key === jsp.key);

      if (foundPage) {
        foundPage.attributes.name = jsp.name;
      } else {
        foundPage = {
          type: 'element',
          name: 'page',
          attributes: {
            name: jsp.name,
            key: jsp.key
          }
        };
        jiraSpec.elements[0].elements.push(foundPage);
      }
    });

    jiraSpec.elements[0].elements
      .filter(e => e.type === 'element' && e.name === 'page' && e.attributes && e.attributes.name && e.attributes.key)
      .forEach(e => {
        const foundPage = jiraSpecPages.find(jsp => jsp.key === e.attributes.key);

        if (!foundPage) {
          e.attributes.deprecated = true;
        }
      });

    const xml = js2xml(jiraSpec, { compact: false, indentCdata: true, indentText: true, indentInstruction: true });

    this.value = vkbeautify.xml(xml);
    this.valueChanged.emit();
  }

  public updateJiraSpecValue() {
    setJiraSpecValue(this.implementationGuide, this.value);
  }

  public download() {
    const contentBlob = new Blob([this.value], {type: 'application/xml'});
    saveAs(contentBlob, 'JIRASpec.xml');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.value = getJiraSpecValue(this.implementationGuide);
  }

  ngOnInit() {
    this.value = getJiraSpecValue(this.implementationGuide);
  }
}
