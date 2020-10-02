import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IDocumentReference, IImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {debounceTime} from 'rxjs/operators';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {generateId, getJiraSpecValue} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {js2xml, xml2js} from 'xml-js';
import * as vkbeautify from 'vkbeautify';
import {ConfigService} from '../../shared/config.service';
import {ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide, PageComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {saveAs} from 'file-saver';

class JiraSpecPageDef {
  name: string;
  key: string;
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
      .pipe(debounceTime(500))
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

  private getSTU3Pages(): JiraSpecPageDef[] {
    const pageDefs: JiraSpecPageDef[] = [];
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

  private getR4Pages(): JiraSpecPageDef[] {
    const pageDefs: JiraSpecPageDef[] = [];
    const r4IG = <R4ImplementationGuide> this.implementationGuide;

    const nextPage = (page: ImplementationGuidePageComponent) => {
      pageDefs.push({
        name: page.title,
        key: JiraSpecComponent.getKey(page.fileName)
      });

      (page.page || []).forEach(p => nextPage(p));
    };

    if (r4IG.definition && r4IG.definition.page) {
      pageDefs.push({
        name: r4IG.definition.page.title,
        key: 'index'
      });

      (r4IG.definition.page.page || [])
        .map(p => new ImplementationGuidePageComponent(p))    // Make sure we're using the class model with the extra functionality
        .filter(p => !!p.fileName)
        .forEach(p => nextPage(p));
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

    let jiraSpecPages: JiraSpecPageDef[];

    if (this.configSerivce.isFhirR4) {
      jiraSpecPages = this.getR4Pages();
    } else if (this.configSerivce.isFhirSTU3) {
      jiraSpecPages = this.getSTU3Pages();
    } else {
      throw new Error('Unexpected FHIR server version!');
    }

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
    if (!this.implementationGuide) return;

    this.implementationGuide.extension = this.implementationGuide.extension || [];
    let foundExtension = this.implementationGuide.extension.find(e => e.url === Globals.extensionUrls['extension-ig-jira-spec']);
    let foundContained = foundExtension && foundExtension.valueReference && foundExtension.valueReference.reference ?
      this.implementationGuide.contained.find(c => c.id === foundExtension.valueReference.reference.substring(1)) :
      null;

    if (!this.value) {
      if (foundExtension) {
        const foundExtensionIndex = this.implementationGuide.extension.indexOf(foundExtension);
        this.implementationGuide.extension.splice(foundExtensionIndex, foundExtensionIndex >= 0 ? 1 : 0);
      }

      if (foundContained) {
        const foundContainedIndex = this.implementationGuide.contained.indexOf(foundContained);
        this.implementationGuide.contained.splice(foundContainedIndex, foundContainedIndex >= 0 ? 1 : 0);
      }
    } else {
      if (!foundExtension) {
        foundExtension = {
          url: Globals.extensionUrls['extension-ig-jira-spec'],
          valueReference: {
            reference: `#${generateId()}`
          }
        };
        this.implementationGuide.extension.push(foundExtension);
      }

      this.implementationGuide.contained = this.implementationGuide.contained || [];

      if (!foundContained) {
        foundContained = <IDocumentReference> {
          resourceType: 'DocumentReference',
          id: foundExtension.valueReference.reference.substring(1),
          type: {
            coding: [{
              code: 'jira-spec'
            }]
          },
          content: [{
            attachment: {
              contentType: 'text/plain',
              title: 'jira-spec.xml',
              data: btoa(this.value)
            }
          }]
        };
        this.implementationGuide.contained.push(foundContained);
      } else {
        const docRef = <IDocumentReference> foundContained;
        docRef.content[0].attachment.data = btoa(this.value);
      }
    }
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
