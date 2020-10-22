import {ImplementationGuide, PackageComponent, PackageResourceComponent, PageComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Severities, ValidatorMessage} from 'fhir/validator';
import {CustomValidator} from './custom-validator';
import {groupBy, parseReference, reduceFlatten} from '../../../../../../libs/tof-lib/src/lib/helper';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';

export class CustomSTU3Validator extends CustomValidator {
  private getAllPages(implementationGuide: ImplementationGuide): PageComponent[] {
    const pages: PageComponent[] = [];

    function next(page: PageComponent) {
      pages.push(page);
      (page.page || []).forEach((nextPage) => next(nextPage));
    }

    if (implementationGuide.page) {
      next(implementationGuide.page);
    }

    return pages;
  }

  public validateImplementationGuide(implementationGuide: ImplementationGuide): ValidatorMessage[] {
    const messages: ValidatorMessage[] = [];
    const allResources = (implementationGuide.package || []).reduce(reduceFlatten<PackageComponent>((next) => next.resource), []);
    const groupedResources = groupBy(allResources, (resource: PackageResourceComponent) => resource.sourceReference ? resource.sourceReference.reference : resource.sourceUri);
    const allPages = this.getAllPages(implementationGuide);
    const groupedPageTitles = groupBy(allPages, (page: PageComponent) => page.title);
    const groupedPageFileNames = groupBy(allPages, (page: PageComponent) => page.source);

    if (implementationGuide.url && !implementationGuide.url.endsWith('/' + implementationGuide.id)) {
      messages.push({
        location: 'ImplementationGuide.url',
        resourceId: implementationGuide.id,
        severity: Severities.Error,
        message: `The url of the implementation guide should end with the ID of the implementation guide. If not, the publishing process will result in a "URL Mismatch" error.`
      });
    }

    const exampleTypeResources = allResources.filter((resource: PackageResourceComponent) => {
      const parsedReference = resource.sourceReference && resource.sourceReference.reference ?
        parseReference(resource.sourceReference.reference) :
        null;

      if (parsedReference) {
        return Globals.profileTypes.concat(Globals.terminologyTypes).indexOf(parsedReference.resourceType) < 0;
      }
    });

    exampleTypeResources.forEach((resource: PackageResourceComponent) => {
      if (!resource.example) {
        messages.push({
          location: 'ImplementationGuide.package.resource',
          resourceId: resource.id,
          severity: Severities.Warning,
          message: 'Resource with reference "' + resource.sourceReference.reference + '" should be flagged as an example.'
        });
      }
    });

    const groupedResourcesKeys = Object.keys(groupedResources);
    groupedResourcesKeys.forEach((groupedResourcesKey) => {
      if (groupedResources[groupedResourcesKey].length > 1) {
        messages.push({
          location: 'ImplementationGuide.package.resource',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `Multiple resources found with reference ${groupedResourcesKey || '""'}`
        });
      }
    });

    if (allPages.filter((page) => !page.title).length > 0) {
      messages.push({
        location: 'ImplementationGuide.page+',
        resourceId: implementationGuide.id,
        severity: Severities.Warning,
        message: 'One more more pages does not have a title'
      });
    }

    const groupedPageTitlesKeys = Object.keys(groupedPageTitles);
    groupedPageTitlesKeys.forEach((groupedPageTitlesKey) => {
      if (groupedPageTitles[groupedPageTitlesKey].length > 1) {
        messages.push({
          location: 'ImplementationGuide.page+',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `Multiple pages found with the same title ${groupedPageTitlesKey || '""'}`
        });
      }
    });

    const groupedPageFileNamesKeys = Object.keys(groupedPageFileNames);
    groupedPageFileNamesKeys.forEach((groupedPageFileNamesKey) => {
      if (groupedPageFileNames[groupedPageFileNamesKey].length > 1) {
        messages.push({
          location: 'ImplementationGuide.page+',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `Multiple pages found with the same source (file name) ${groupedPageFileNamesKey || '""'}`
        });
      }
    });

    allPages.forEach((page: PageComponent) => {
      const pageClone = new PageComponent(page);

      if (page === implementationGuide.page && pageClone.source !== 'index.md') {
        messages.push({
          location: 'ImplementationGuide.definition.page',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `It is strongly encouraged that the root page of the implementation guide have a file name of "index.html". Otherwise, the published implementation guide may not contain a home page.`
        });
      }

      if (!pageClone.contentMarkdown) {
        messages.push({
          location: 'ImplementationGuide.page+',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `The page with title ${page.title} does not specify content.`
        });
      }
    });

    allResources.forEach((resource: PackageResourceComponent) => {
      if (resource.sourceUri) {
        messages.push({
          location: 'ImplementationGuide.package.resource',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `A resource within a package uses a URI ${resource.sourceUri} instead of a relative reference. This resource will not export correctly.`
        });
      }
    });

    return messages;
  }
}
