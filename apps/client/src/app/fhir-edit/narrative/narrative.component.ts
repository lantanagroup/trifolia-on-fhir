import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomainResource, ImplementationGuide as STU3ImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import Mustache from 'mustache';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../shared/config.service';
import {ImplementationGuide as R4ImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ImplementationGuide as R5ImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/r5/fhir';
import {AngularEditorConfig} from '@kolkov/angular-editor';

interface ResourceView {
  resource: any;
}

interface CapabilityStatementView extends ResourceView {

}

interface OperationDefinitionView extends ResourceView {

}

interface QuestionnaireView extends ResourceView {

}

interface CodeSystemView extends ResourceView {

}

interface ValueSetView extends ResourceView {
  hasIdentifiers: boolean;
  hasIncludes: boolean;
  hasExcludes: boolean;
  includeSummaries: string[];
  excludeSummaries: string[];
}

interface ImplementationGuideView extends ResourceView {
  hasPages?: boolean;
  pages?: [{
    title: string;
  }];
  hasResources?: boolean;
  resources?: [{
    reference?: string;
    display?: string;
  }];
}

interface StructureDefinitionView extends ResourceView {
  status?: string;
  hasElements?: boolean;
}

@Component({
  selector: 'app-fhir-narrative',
  templateUrl: './narrative.component.html',
  styleUrls: ['./narrative.component.css']
})
export class NarrativeComponent implements OnInit {
  @Input() resource: DomainResource;
  public message: string;
  public editorConfig: AngularEditorConfig;
  public theDiv = '';


  @Output() change: EventEmitter<void> = new EventEmitter<void>();
  public textChanged: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    private http: HttpClient,
    private configService: ConfigService) {

    this.textChanged.subscribe(() => {
      this.resource.text.div = '<div>' + this.theDiv + '</div>';

    });

  }

  private populateCodeSystemView(view: CodeSystemView, resource: any) {

  }

  private populateCapabilityStatementView(view: CapabilityStatementView, resource: any) {

  }

  private populateOperationDefinitionView(view: OperationDefinitionView, resource: any) {

  }

  private populateQuestionnaireView(view: QuestionnaireView, resource: any) {

  }

  private populateValueSetView(view: ValueSetView, resource: any) {
    view.hasIdentifiers = resource.identifier && resource.identifier.length > 0;
    view.hasIncludes = resource.compose && resource.compose.include && resource.compose.include.length > 0;
    view.hasExcludes = resource.compose && resource.compose.exclude && resource.compose.exclude.length > 0;

    const getSummary = (item: any) => {
      let summary;

      if (item.system && item.concept && item.concept.length > 0) {
        summary = `Includes ${item.concept.length} codes from system ${item.system}`;

        if (item.version) {
          summary += ` and version ${item.version}`;
        }
      } else if (item.valueSet && item.valueSet.length > 0) {
        summary = `Includes codes from value sets ${item.valueSet.join(', ')}`;
      }

      (item.filter || []).forEach((filter: any, index: number) => {
        if (summary && index === 0) {
          summary += ' with filter ';
        } else if (!summary && index === 0) {
          summary += 'Filter ';
        } else if (summary && index >= 0) {
          summary += ' and ';
        }

        summary += `[${filter.property} ${filter.op} ${filter.value}]`;
      });

      return summary;
    };

    if (view.hasIncludes) {
      view.includeSummaries = (resource.compose.include || []).map((include: any) => getSummary(include));
    }

    if (view.hasExcludes) {
      view.excludeSummaries = (resource.compose.exclude || []).map((exclude: any) => getSummary(exclude));
    }
  }

  private populateStructureDefinitionView(view: StructureDefinitionView, resource: any) {
    if (resource.status) {
      view.status = resource.status.substring(0, 1).toUpperCase() + resource.status.substring(1);
    }

    view.hasElements = resource.differential && resource.differential.element && resource.differential.element.length > 0;
  }

  public generateNarrative() {
    if (!confirm('Generating new narrative text for the resource will overwrite any existing narrative text. Are you sure you want to proceed?')) {
      return;
    }


    this.http.get(`/assets/narrative-templates/${this.resource.resourceType}.mustache`, { responseType: 'text' })
      .subscribe((results) => {
        const view = this.getNarrativeView(this.resource);
        const html = Mustache.render(results, view);
        this.resource.text.div = '<div>' + html + '</div>';
        this.change.emit();
        this.ngOnInit();
      });


  }

  private getNarrativeView(resource: any) {
    const view: any = {
      resource: resource
    };

    try {
      switch (resource.resourceType) {
        case 'ImplementationGuide':
          this.populateImplementationGuideView(view, resource);
          break;
        case 'StructureDefinition':
          this.populateStructureDefinitionView(view, resource);
          break;
        case 'ValueSet':
          this.populateValueSetView(view, resource);
          break;
        case 'CodeSystem':
          this.populateCodeSystemView(view, resource);
          break;
        case 'OperationDefinition':
          this.populateOperationDefinitionView(view, resource);
          break;
        case 'CapabilityStatement':
          this.populateCapabilityStatementView(view, resource);
          break;
        case 'Questionnaire':
          this.populateQuestionnaireView(view, resource);
          break;
      }
    } catch (ex) {
      console.error(`Error while populating narrative view: ${ex}`);
    }

    return view;
  }

  private populateImplementationGuideView(view: ImplementationGuideView, resource: any) {
    const r5ImplementationGuide = this.configService.isFhirR5 ? <R5ImplementationGuide>resource : undefined;
    const r4ImplementationGuide = this.configService.isFhirR4 ? <R4ImplementationGuide>resource : undefined;
    const stu3ImplementationGuide = this.configService.isFhirSTU3 ? <STU3ImplementationGuide>resource : undefined;

    if (!this.configService.isFhirR5 && !this.configService.isFhirR4 && !this.configService.isFhirSTU3) {
      throw new Error(`Unexpected FHIR version: ${this.configService.fhirVersion}`);
    }

    const getPages = (parent) => {
      if (parent.page) {
        view.pages = <any>view.pages.concat(parent.page);
        (parent.page || []).forEach((next) => getPages(next));
      }
    };

    if (stu3ImplementationGuide) {
      if (stu3ImplementationGuide.page) {
        view.hasPages = true;
        view.pages = [stu3ImplementationGuide.page];
        getPages(stu3ImplementationGuide.page);
      }

      (stu3ImplementationGuide.package || []).forEach((igPackage) => {
        (igPackage.resource || []).forEach((next) => {
          view.resources = view.resources || <any>[];
          view.resources.push({
            reference: next.sourceReference ? next.sourceReference.reference : undefined,
            display: next.name ? next.name : (next.sourceReference ? next.sourceReference.display : undefined)
          });
        });
      });

      view.hasResources = !!view.resources;
    } else if (r4ImplementationGuide) {
      if (r4ImplementationGuide.definition) {
        if (r4ImplementationGuide.definition.page) {
          view.hasPages = true;
          view.pages = [r4ImplementationGuide.definition.page];
          getPages(r4ImplementationGuide.definition.page);
        }

        if (r4ImplementationGuide.definition.resource && r4ImplementationGuide.definition.resource.length > 0) {
          view.hasResources = true;
          view.resources = <any> (r4ImplementationGuide.definition.resource || []).map((next) => {
            return {
              reference: next.reference ? next.reference.reference : undefined,
              display: next.name ? next.name : (next.reference ? next.reference.display : undefined)
            };
          });
        }
      }
    } else if (r5ImplementationGuide) {
      if (r5ImplementationGuide.definition) {
        if (r5ImplementationGuide.definition.page) {
          view.hasPages = true;
          view.pages = [r5ImplementationGuide.definition.page];
          getPages(r5ImplementationGuide.definition.page);
        }

        if (r5ImplementationGuide.definition.resource && r5ImplementationGuide.definition.resource.length > 0) {
          view.hasResources = true;
          view.resources = <any> (r5ImplementationGuide.definition.resource || []).map((next) => {
            return {
              reference: next.reference ? next.reference.reference : undefined,
              display: next.name ? next.name : (next.reference ? next.reference.display : undefined)
            };
          });
        }
      }
    }
  }

  public toggleNarrative(hasNarrative: boolean) {
    if (hasNarrative && !this.resource.text) {
      this.resource.text = {
        status: 'additional',
        div: '<div></div>'
      };
    } else if (!hasNarrative && this.resource.text) {
      delete this.resource.text;
    }
    this.editorConfig.editable = !!this.resource && !!this.resource.text && this.resource.text.hasOwnProperty('div');;
  }

  ngOnInit() {
    const editable = !!this.resource && !!this.resource.text && this.resource.text.hasOwnProperty('div');
    this.editorConfig = {
      editable: editable
    };

    if (!this.resource || !this.resource.text || !this.resource.text.div) {
      this.theDiv = '';
    }
    else{
      this.theDiv = this.resource.text.div.trim();

      if (this.theDiv.startsWith('<div>') && this.theDiv.endsWith('</div>')) {
        this.theDiv = this.theDiv.substring('<div>'.length, this.theDiv.length - '</div>'.length);
      }
    }
  }
}
