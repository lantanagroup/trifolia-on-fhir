import {Component, Input, OnInit} from '@angular/core';
import {DomainResource} from '../../models/stu3/fhir';
import * as _ from 'underscore';
import * as Mustache from 'mustache';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../shared/config.service';
import {ImplementationGuide as STU3ImplementationGuide} from '../../models/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide} from '../../models/r4/fhir';
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
        package?: string;
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

    constructor(
        private http: HttpClient,
        private configService: ConfigService) {
    }

    public get textDiv(): string {
        if (!this.resource || !this.resource.text || !this.resource.text.div) {
            return '';
        }

        const div = this.resource.text.div.trim();

        if (div.startsWith('<div>') && div.endsWith('</div>')) {
            const ret = div.substring('<div>'.length, div.length - '</div>'.length);
            return ret;
        }

        return this.resource.text.div;
    }

    public set textDiv(value: string) {
        if (!this.resource || !this.resource.text || !this.resource.text.div) {
            return;
        }

        this.resource.text.div = '<div>' + value + '</div>';
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

            _.each(item.filter, (filter: any, index: number) => {
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
            view.includeSummaries = _.map(resource.compose.include, (include: any) => getSummary(include));
        }

        if (view.hasExcludes) {
            view.excludeSummaries = _.map(resource.compose.exclude, (exclude: any) => getSummary(exclude));
        }
    }

    private populateStructureDefinitionView(view: StructureDefinitionView, resource: any) {
        if (resource.status) {
            view.status = resource.status.substring(0, 1).toUpperCase() + resource.status.substring(1);
        }

        view.hasElements = resource.differential && resource.differential.element && resource.differential.element.length > 0;
    }

    private populateImplementationGuideView(view: ImplementationGuideView, resource: any) {
        const r4ImplementationGuide = this.configService.isFhirR4 ? <R4ImplementationGuide> resource : undefined;
        const stu3ImplementationGuide = this.configService.isFhirSTU3 ? <STU3ImplementationGuide> resource : undefined;
        const getPages = (parent) => {
            if (parent.page) {
                view.pages = <any> view.pages.concat(parent.page);
                _.each(parent.page, (next) => getPages(next));
            }
        };

        if (stu3ImplementationGuide) {
            if (stu3ImplementationGuide.page) {
                view.hasPages = true;
                view.pages = [stu3ImplementationGuide.page];
                getPages(stu3ImplementationGuide.page);
            }

            _.each(stu3ImplementationGuide.package, (igPackage) => {
                _.each(igPackage.resource, (next) => {
                    view.resources = view.resources || <any> [];
                    view.resources.push({
                        reference: next.sourceReference ? next.sourceReference.reference : undefined,
                        display: next.name ? next.name : (next.sourceReference ? next.sourceReference.display : undefined),
                        package: igPackage.name
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
                    view.resources = <any> _.map(r4ImplementationGuide.definition.resource, (next) => {
                        return {
                            reference: next.reference ? next.reference.reference : undefined,
                            display: next.name ? next.name : (next.reference ? next.reference.display : undefined),
                            package: next.package
                        };
                    });
                }
            }
        }
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

    public generateNarrative() {
        if (!confirm('Generating new narrative text for the resource will overwrite any existing narrative text. Are you sure you want to proceed?')) {
            return;
        }

        this.http.get(`/assets/narrative-templates/${this.resource.resourceType}.mustache`, { responseType: 'text' })
            .subscribe((results) => {
                const view = this.getNarrativeView(this.resource);
                const html = Mustache.render(results, view);
                this.resource.text.div = '<div>' + html + '</div>';
            });
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

        const editable = !!this.resource && !!this.resource.text && this.resource.text.hasOwnProperty('div');
        this.editorConfig.editable = editable;
    }

    ngOnInit() {
        const editable = !!this.resource && !!this.resource.text && this.resource.text.hasOwnProperty('div');
        this.editorConfig = {
            editable: editable
        };
    }
}
