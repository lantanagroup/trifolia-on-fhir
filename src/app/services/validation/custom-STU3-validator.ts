import {ImplementationGuide, PackageComponent, PackageResourceComponent, PageComponent} from '../../models/stu3/fhir';
import {Severities, ValidatorMessage} from 'fhir/validator';
import {CustomValidator} from './custom-validator';
import {FhirService} from '../fhir.service';
import * as _ from 'underscore';

export class CustomSTU3Validator extends CustomValidator {
    constructor(fhirService: FhirService) { super(fhirService); }

    private getAllPages(implementationGuide: ImplementationGuide): PageComponent[] {
        const pages: PageComponent[] = [];

        function next(page: PageComponent) {
            pages.push(page);
            _.each(page.page, (nextPage) => next(nextPage));
        }

        if (implementationGuide.page) {
            next(implementationGuide.page);
        }

        return pages;
    }

    public validateImplementationGuide(implementationGuide: ImplementationGuide): ValidatorMessage[] {
        const messages: ValidatorMessage[] = [];
        const allResources = _.flatten(_.map(implementationGuide.package, (nextPackage: PackageComponent) => nextPackage.resource));
        const groupedResources = _.groupBy(allResources, (resource: PackageResourceComponent) => resource.sourceReference ? resource.sourceReference.reference : resource.sourceUri);
        const allPages = this.getAllPages(implementationGuide);
        const groupedPageTitles = _.groupBy(allPages, (page: PageComponent) => page.title);
        const groupedPageFileNames = _.groupBy(allPages, (page: PageComponent) => page.source);

        if (implementationGuide.url && !implementationGuide.url.endsWith('/' + implementationGuide.id)) {
            messages.push({
                location: 'ImplementationGuide.url',
                resourceId: implementationGuide.id,
                severity: Severities.Error,
                message: `The url of the implementation guide should end with the ID of the implementation guide. If not, the publishing process will result in a "URL Mismatch" error.`
            });
        }

        const exampleTypeResources = _.filter(allResources, (resource: PackageResourceComponent) => {
            const parsedReference = resource.sourceReference && resource.sourceReference.reference ?
                this.fhirService.parseReference(resource.sourceReference.reference) : null;

            if (parsedReference) {
                return this.fhirService.profileTypes.concat(this.fhirService.terminologyTypes).indexOf(parsedReference.resourceType) < 0;
            }
        });

        _.each(exampleTypeResources, (resource: PackageResourceComponent) => {
            if (!resource.example) {
                messages.push({
                    location: 'ImplementationGuide.package.resource',
                    resourceId: resource.id,
                    severity: Severities.Warning,
                    message: 'Resource with reference "' + resource.sourceReference.reference + '" should be flagged as an example.'
                });
            }
        });

        _.each(groupedResources, (resourceGroup, reference) => {
            if (resourceGroup.length > 1) {
                messages.push({
                    location: 'ImplementationGuide.package.resource',
                    resourceId: implementationGuide.id,
                    severity: Severities.Warning,
                    message: `Multiple resources found with reference ${reference || '""'}`
                });
            }
        });

        if (_.filter(allPages, (page) => !page.title).length > 0) {
            messages.push({
                location: 'ImplementationGuide.page+',
                resourceId: implementationGuide.id,
                severity: Severities.Warning,
                message: 'One more more pages does not have a title'
            });
        }

        _.each(groupedPageTitles, (pages, title) => {
            if (pages.length > 1) {
                messages.push({
                    location: 'ImplementationGuide.page+',
                    resourceId: implementationGuide.id,
                    severity: Severities.Warning,
                    message: `Multiple pages found with the same title ${title || '""'}`
                });
            }
        });

        _.each(groupedPageFileNames, (pages, fileName) => {
            if (pages.length > 1) {
                messages.push({
                    location: 'ImplementationGuide.page+',
                    resourceId: implementationGuide.id,
                    severity: Severities.Warning,
                    message: `Multiple pages found with the same source (file name) ${fileName || '""'}`
                });
            }
        });

        _.each(allPages, (page: PageComponent) => {
            const foundContentExtension = _.find(page.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content');

            if (!foundContentExtension) {
                messages.push({
                    location: 'ImplementationGuide.page+',
                    resourceId: implementationGuide.id,
                    severity: Severities.Warning,
                    message: `The page with title ${page.title} does not specify content.`
                });
            }
        });

        _.each(allResources, (resource: PackageResourceComponent) => {
            if (resource.sourceUri) {
                messages.push({
                    location: 'ImplementationGuide.package.resource',
                    resourceId: implementationGuide.id,
                    severity: Severities.Warning,
                    message: `A resource within a package uses a URI ${resource.sourceUri} instead of a relative reference. This resource will not export correctly.`
                });
            }
        })

        return messages;
    }
}