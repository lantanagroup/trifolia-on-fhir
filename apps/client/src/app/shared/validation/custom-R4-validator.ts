import {
  ImplementationGuide as R4ImplementationGuide,
  ImplementationGuidePageComponent,
  ImplementationGuideResourceComponent
} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Severities, ValidatorMessage} from 'fhir/validator';
import {CustomValidator} from './custom-validator';
import { groupBy, parseReference } from '../../../../../../libs/tof-lib/src/lib/helper';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';

export class CustomR4Validator extends CustomValidator {
  private getAllPages(implementationGuide: R4ImplementationGuide): ImplementationGuidePageComponent[] {
    const pages: ImplementationGuidePageComponent[] = [];

    function next(page: ImplementationGuidePageComponent) {
      pages.push(page);
      (page.page || []).forEach((nextPage) => next(nextPage));
    }

    if (implementationGuide.definition.page) {
      next(implementationGuide.definition.page);
    }

    return pages;
  }

  public validateImplementationGuide(implementationGuide: R4ImplementationGuide): ValidatorMessage[] {
    if (!implementationGuide.definition) {
      return [];
    }

    const messages: ValidatorMessage[] = [];
    const allResources = implementationGuide.definition.resource || [];
    const groupedResources = groupBy(allResources, (resource: ImplementationGuideResourceComponent) => resource.reference ? resource.reference.reference : null);
    const allPages = this.getAllPages(implementationGuide);
    const groupedPageTitles = groupBy(allPages, (page: ImplementationGuidePageComponent) => page.title);
    const allProfileTypes = Globals.profileTypes.concat(Globals.terminologyTypes);

    if (implementationGuide.url && !implementationGuide.url.endsWith('/' + implementationGuide.id)) {
      messages.push({
        location: 'ImplementationGuide.url',
        resourceId: implementationGuide.id,
        severity: Severities.Error,
        message: `The url of the implementation guide should end with the ID of the implementation guide. If not, the publishing process will result in a "URL Mismatch" error.`
      });
    }

    allResources.forEach((resource: ImplementationGuideResourceComponent, index) => {
      if (!resource.reference || !resource.reference.reference) {
        messages.push({
          location: 'ImplementationGuide.definition.resource',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `Resource #${index + 1} does not have a reference`
        });
      } else {
        const parsedReference = parseReference(resource.reference.reference);

        if (resource.exampleBoolean || resource.exampleCanonical) {
          if (parsedReference && allProfileTypes.indexOf(parsedReference.resourceType) >= 0) {
            messages.push({
              location: 'ImplementationGuide.definition.resource',
              resourceId: implementationGuide.id,
              severity: Severities.Warning,
              message: `Resource with reference ${resource.reference.reference} may incorrectly be flagged as an example`
            });
          }
        } else {
          if (allProfileTypes.indexOf(parsedReference.resourceType) < 0) {
            messages.push({
              location: 'ImplementationGuide.definition.resource',
              resourceId: implementationGuide.id,
              severity: Severities.Warning,
              message: `Resource with reference ${resource.reference.reference} should be flagged as an example`
            });
          }
        }
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

    const groupedPageTitlesKeys = Object.keys(groupedPageTitles);
    groupedPageTitlesKeys.forEach((groupedPageTitlesKey) => {
      if (!groupedPageTitlesKey && groupedPageTitles[groupedPageTitlesKey].length > 0) {
        messages.push({
          location: 'ImplementationGuide.definition.page+',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `One or more pages does not have a title. It will not be exported.`
        });
      }

      if (groupedPageTitlesKey && groupedPageTitles[groupedPageTitlesKey].length > 1) {
        messages.push({
          location: 'ImplementationGuide.definition.page+',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `Multiple pages found with the same title ${groupedPageTitlesKey || '""'}`
        });
      }
    });

    allPages.forEach((page: ImplementationGuidePageComponent) => {
      const pageClone = new ImplementationGuidePageComponent(page);

      if (page === implementationGuide.definition.page && pageClone.fileName !== 'index.html') {
        messages.push({
          location: 'ImplementationGuide.definition.page',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `It is strongly encouraged that the root page of the implementation guide have a file name of "index.html". Otherwise, the published implementation guide may not contain a home page.`
        });
      }

      if (!pageClone.fileName) {
        messages.push({
          location: 'ImplementationGuide.definition.page+',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `Page with title ${page.title} does not specify a file name and will not publish correctly.`
        });
      }

      const regexp: RegExp = /[^A-Za-z0-9\._\-]/;
      if(regexp.test(pageClone.fileName)) {
        messages.push({
          location: 'ImplementationGuide.definition.page+',
          resourceId: implementationGuide.id,
          severity: Severities.Error,
          message: `Page with title ${page.title} must not include special characters such as "&" and "/" in the file name.`
        })
      }

      if (!pageClone.reuseDescription && !pageClone.contentMarkdown) {
        messages.push({
          location: 'ImplementationGuide.definition.page+',
          resourceId: implementationGuide.id,
          severity: Severities.Warning,
          message: `Page with title ${page.title} does not have any content`
        });
      }
    });

    return messages;
  }
}
