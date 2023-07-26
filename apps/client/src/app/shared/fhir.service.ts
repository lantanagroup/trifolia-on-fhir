import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  Bundle,
  CodeSystem,
  Coding,
  ConceptDefinitionComponent,
  ConceptSetComponent,
  DomainResource,
  IssueComponent,
  OperationOutcome,
  Resource,
  StructureDefinition,
  ValueSet
} from '@trifolia-fhir/stu3';
import {forkJoin, Observable} from 'rxjs';
import {Fhir, Versions} from 'fhir/fhir';
import {ParseConformance} from 'fhir/parseConformance';
import {ConfigService} from './config.service';
import {Severities, ValidatorMessage, ValidatorResponse} from 'fhir/validator';
import {Globals, ICoding} from '@trifolia-fhir/tof-lib';
import {CustomValidator} from './validation/custom-validator';
import {CustomSTU3Validator} from './validation/custom-STU3-validator';
import * as vkbeautify from 'vkbeautify';
import {publishReplay, refCount} from 'rxjs/operators';
import {IBundle} from '@trifolia-fhir/tof-lib';
import {IFhirResource} from '@trifolia-fhir/models';
import {Paginated} from '@trifolia-fhir/tof-lib';

export interface IResourceGithubDetails {
  owner: string;
  repository: string;
  branch: string;
  path: string;
}

export class ResourceGithubDetails implements IResourceGithubDetails {
  owner: string;
  repository: string;
  branch: string;
  path: string;
}

@Injectable()
export class FhirService {
  public fhir: Fhir;
  public fhirVersion: string = 'r4';
  public loaded: boolean;
  public profiles: StructureDefinition[] = [];
  public valueSets: (ValueSet | CodeSystem)[] = [];
  private customValidator: CustomValidator;

  constructor(
    private injector: Injector,
    private configService: ConfigService) {

    this.customValidator = new CustomSTU3Validator();

    this.loadAssets();

    /* this.configService.fhirServerChanged.subscribe(() => {
       if (this.loaded) {
         // noinspection JSIgnoredPromiseFromCall
         this.loadAssets();
       }

       if (identifyRelease(this.configService.fhirConformanceVersion) === Versions.R4) {
         this.customValidator = new CustomR4Validator();
       } else {            // Assume default of STU3
         this.customValidator = new CustomSTU3Validator();
       }
     });*/
  }

  public get primitiveTypes(): string[] {
    if (this.configService.isFhirSTU3) {
      return ['instant', 'time', 'date', 'dateTime', 'base64Binary', 'decimal',
        'boolean', 'code', 'string', 'integer', 'uri', 'markdown',
        'id', 'oid', 'unsignedInt', 'positiveInt', 'Element'];
    } else if (this.configService.isFhirR4) {
      return ['instant', 'time', 'date', 'dateTime', 'base64Binary', 'decimal',
        'boolean', 'url', 'code', 'string', 'integer', 'uri', 'canonical', 'markdown',
        'id', 'oid', 'uuid', 'unsignedInt', 'positiveInt', 'Element'];
    } else if (this.configService.isFhirR5) {
      return ['instant', 'time', 'date', 'dateTime', 'base64Binary', 'decimal',
        'integer64', 'boolean', 'url', 'code', 'string', 'integer', 'uri',
        'canonical', 'markdown', 'id', 'oid', 'uuid', 'unsignedInt',
        'positiveInt'];
    } else {
      throw new Error(`Unexpected FHIR version: ${this.configService.fhirVersion}`);
    }
  }

  public get dataTypes(): string[] {
    if (this.configService.isFhirSTU3) {
      return ['Address', 'Age', 'Ratio', 'Period', 'Range', 'Attachment',
        'Identifier', 'Timing', 'HumanName', 'Coding', 'Annotation',
        'Signature', 'CodeableConcept', 'Quantity', 'SampledData',
        'ContactPoint', 'Distance', 'SimpleQuantity', 'Duration', 'Count',
        'Money', 'instant', 'time', 'date', 'dateTime', 'base64Binary',
        'decimal', 'boolean', 'code', 'string', 'integer', 'uri', 'markdown',
        'id', 'oid', 'unsignedInt', 'positiveInt', 'Element'];
    } else if (this.configService.isFhirR4) {
      return ['Ratio', 'Period', 'Range', 'Attachment', 'Identifier',
        'Annotation', 'HumanName', 'CodeableConcept', 'ContactPoint', 'Coding',
        'Money', 'Address', 'Timing', 'BackboneElement', 'Quantity',
        'SampledData', 'Signature', 'Age', 'Distance', 'Duration', 'Count',
        'MoneyQuantity', 'SimpleQuantity', 'ContactDetail', 'Contributor',
        'DataRequirement', 'RelatedArtifact', 'UsageContext',
        'ParameterDefinition', 'Expression', 'TriggerDefinition', 'Reference',
        'Meta', 'Dosage', 'xhtml', 'Narrative', 'Extension',
        'ElementDefinition', 'instant', 'time', 'date', 'dateTime',
        'base64Binary', 'decimal', 'boolean', 'url', 'code', 'string',
        'integer', 'uri', 'canonical', 'markdown', 'id', 'oid', 'uuid',
        'unsignedInt', 'positiveInt', 'Element'];
    } else if (this.configService.isFhirR5) {
      return ['instant', 'time', 'date', 'dateTime', 'base64Binary', 'decimal',
        'integer64', 'boolean', 'url', 'code', 'string', 'integer', 'uri',
        'canonical', 'markdown', 'id', 'oid', 'uuid', 'unsignedInt',
        'positiveInt', 'Ratio', 'Period', 'Range', 'RatioRange', 'Attachment',
        'Identifier', 'Annotation', 'HumanName', 'CodeableConcept',
        'ContactPoint', 'Coding', 'Address', 'Timing', 'BackboneType',
        'Quantity', 'SampledData', 'Signature', 'Age', 'Distance', 'Duration',
        'Count', 'MoneyQuantity', 'SimpleQuantity', 'xhtml', 'ContactDetail',
        'Contributor', 'DataRequirement', 'RelatedArtifact',
        'TriggerDefinition', 'ParameterDefinition', 'ExtendedContactDetail',
        'Availability', 'Expression', 'UsageContext', 'MonetaryComponent',
        'VisualServiceDetail'];
    } else {
      throw new Error(`Unexpected FHIR version: ${this.configService.fhirVersion}`);
    }
  }

  public get http(): HttpClient {
    return this.injector.get(HttpClient);
  }

  public async setFhirVersion(fhirVersion?: string) {
    if (this.fhirVersion === fhirVersion && this.loaded == true) {
      return Promise.resolve();
    }
    this.fhirVersion = fhirVersion;
    this.loadAssets();
  }

  public loadAssets() {
    this.loaded = false;
    const loadDirectory = this.fhirVersion;

    const assetPromises = [
      this.http.get('/assets/' + loadDirectory + '/codesystem-iso3166.json').pipe(publishReplay(1), refCount()),
      this.http.get('/assets/' + loadDirectory + '/valuesets.json').pipe(publishReplay(1), refCount()),
      this.http.get('/assets/' + loadDirectory + '/profiles-types.json').pipe(publishReplay(1), refCount()),
      this.http.get('/assets/' + loadDirectory + '/profiles-resources.json').pipe(publishReplay(1), refCount())
    ];

    return new Promise<void>((resolve, reject) => {
      forkJoin(assetPromises)
        .subscribe((allAssets) => {
          const parser = new ParseConformance(false, this.configService.fhirVersion);
          parser.loadCodeSystem(allAssets[0]);
          parser.parseBundle(allAssets[1]);
          parser.parseBundle(allAssets[2]);
          parser.parseBundle(allAssets[3]);

          this.fhir = new Fhir(parser);

          this.valueSets = (<Bundle>allAssets[1]).entry.map((entry) => <ValueSet>entry.resource);
          this.valueSets.push(<CodeSystem>allAssets[0]);
          this.profiles = (<Bundle>allAssets[2]).entry
            .concat((<Bundle>allAssets[3]).entry)
            .map((entry) => <StructureDefinition>entry.resource);

          this.loaded = true;
          resolve();
        }, (err) => {
          reject(err);
        });
    });
  }

  private getSystemConcepts(concepts: ConceptDefinitionComponent[]): Coding[] {
    let all = [];

    (concepts || []).forEach((concept) => {
      all.push(new Coding(concept));
      const next = this.getSystemConcepts(concept.concept);
      all = all.concat(next);
    });

    return all;
  }

  public getResourceGithubDetails(resource: DomainResource): ResourceGithubDetails {
    const branchExtensionUrl = this.configService.fhirVersion === Versions.R4.toLowerCase() ?
      Globals.extensionUrls['github-branch'] :
      Globals.extensionUrls['github-branch'];
    const pathExtensionUrl = this.configService.fhirVersion === Versions.R4.toLowerCase() ?
      Globals.extensionUrls['github-path'] :
      Globals.extensionUrls['github-path'];

    const branchExtension = (resource.extension || []).find((extension) => extension.url === branchExtensionUrl);
    const pathExtension = (resource.extension || []).find((extension) => extension.url === pathExtensionUrl);
    const pathSplit = pathExtension && pathExtension.valueString ? pathExtension.valueString.split('/') : [];

    const details = new ResourceGithubDetails();
    details.owner = pathSplit.length >= 1 ? pathSplit[0] : null;
    details.repository = pathSplit.length >= 2 ? pathSplit[1] : null;
    details.branch = branchExtension && branchExtension.valueString ? branchExtension.valueString : null;
    details.path = pathSplit.length >= 3 ? pathSplit.slice(2).join('/') : null;

    return details;
  }

  public setResourceGithubDetails(resource: DomainResource, details: IResourceGithubDetails) {
    if (!resource.extension) {
      resource.extension = [];
    }

    const branchExtensionUrl = this.configService.fhirVersion === Versions.R4.toLowerCase() ?
      Globals.extensionUrls['github-branch'] :
      Globals.extensionUrls['github-branch'];
    const pathExtensionUrl = this.configService.fhirVersion === Versions.R4.toLowerCase() ?
      Globals.extensionUrls['github-path'] :
      Globals.extensionUrls['github-path'];

    let branchExtension = (resource.extension || []).find((extension) => extension.url === branchExtensionUrl);
    let pathExtension = (resource.extension || []).find((extension) => extension.url === pathExtensionUrl);

    if (!branchExtension) {
      branchExtension = { url: branchExtensionUrl };
      resource.extension.push(branchExtension);
    }

    if (!pathExtension) {
      pathExtension = { url: pathExtensionUrl };
      resource.extension.push(pathExtension);
    }

    branchExtension.valueString = details.branch;
    pathExtension.valueString = details.owner + '/' + details.repository + '/' + (details.path.startsWith('/') ? details.path.substring(1) : details.path);
  }

  public getValueSetCodes(valueSetUrl: string): ICoding[] {
    let codes: Coding[] = [];
    const foundValueSet = <ValueSet>this.valueSets
      .filter((item) => item.resourceType === 'ValueSet')
      .find((valueSet) => valueSet.url === valueSetUrl);

    if (foundValueSet) {
      if (foundValueSet.compose) {
        (foundValueSet.compose.include || []).forEach((include: ConceptSetComponent) => {
          const foundSystem: CodeSystem = <CodeSystem><any>this.valueSets
            .filter((item) => item.resourceType === 'CodeSystem')
            .find((codeSystem) => codeSystem.url === include.system);

          if (foundSystem) {
            const csCodes = this.getSystemConcepts(foundSystem.concept);
            codes = codes.concat(csCodes);
          }

          const includeCodes = (include.concept || []).map((concept) => {
            return {
              system: include.system,
              code: concept.code,
              display: concept.display || concept.code
            };
          });
          codes = codes.concat(includeCodes);
        });
      }
    }

    return codes;
  }

  public changeResourceId(resourceType: string, originalId: string, newId: string): Observable<string> {
    const url = `/api/fhir/${resourceType}/${encodeURIComponent((originalId))}/$change-id?&newId=${encodeURIComponent(newId)}`;
    return this.http.post(url, null, { responseType: 'text' });
  }

  /**
   * Searches the FHIR server for all resources matching the specified ResourceType
   * @param {string} resourceType
   * @param {string} [searchContent]
   * @param {boolean} [summary]
   * @param {string} [searchUrl]
   * @param {string} [id]
   * @param [additionalQuery]
   * @param {boolean} [separateArrayQuery]
   * @param {boolean} [sortID]
   * @param {number} [page]
   * @param {number} [count]
   * @param ignoreContext Does *not* send the context implementation guide in the headers to limit the search results
   */
  public search(resourceType: string, searchContent?: string, summary?: boolean, searchUrl?: string, id?: string, implementationGuideId?: string, additionalQuery?: { [id: string]: string | string[] }, separateArrayQuery = false, sortID = false, page?: number) {
    let url = '/api/fhirResources?resourcetype=' + resourceType + '&page=' + page + '&'; //+ `_count=${count}&`;

    if (searchContent) {
      url += `_content=${encodeURIComponent(searchContent)}&`;
    }

    if (searchUrl) {
      url += `url=${encodeURIComponent(searchUrl)}&`;
    }

    if (id) {
      url += `id=${encodeURIComponent(id)}&`;
    }

    if (implementationGuideId) {
      url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
    }

    if (additionalQuery) {
      const keys = Object.keys(additionalQuery);
      keys.forEach((key) => {
        const value = additionalQuery[key];

        if (value instanceof Array) {
          if (separateArrayQuery) {
            value.forEach((next) => {
              url += `${encodeURIComponent(key)}=${encodeURIComponent(next)}&`;
            });
          } else {
            url += `${encodeURIComponent(key)}=${encodeURIComponent(value.join(','))}&`;
          }
        } else {
          url += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
        }
      });
    }

    if (sortID) url += '_sort=resourceid&';

    return this.http.get<Paginated<IFhirResource>>(url);
  }


  /**
   * Retrieves the specified resource id
   * @param {string} resourceType
   * @param {string} id
   */
  public readById(resourceType: string, id: string) {
    let url = '';
    if (resourceType == 'fhirResource') {
      url = '/api/fhirResources/' + encodeURIComponent(id);
    } else if (resourceType == 'example') {
      url = '/api/example/' + encodeURIComponent(id);
    }
    return this.http.get(url);
  }

  /**
   * Deletes the specified resource from the FHIR server
   * @param {string} resourceType
   * @param {string} id
   */
  public delete(id: string) {
    const url = `/api/fhirResources/${id}`;
    return this.http.delete(url);
  }

  /**
   * Updates the specified resource on the FHIR server
   * @param {string} resourceType
   * @param {string} id
   * @param {Resource} resource
   */
  public update(id: string, fhirResource: IFhirResource): Observable<IFhirResource> {
    if (id) {
      const url = '/api/fhirResources/' + encodeURIComponent(id);
      return this.http.put<IFhirResource>(url, fhirResource);
    } else {
      return this.http.post<IFhirResource>('/api/codeSystem', fhirResource);
    }
  }

  public patch(resourceType: string, id: string, patches: { op: string, path: string, value: any }[]) {
    const url = `/api/fhir/${resourceType}/${id}`;
    return this.http.patch(url, patches);
  }

  /**
   * Creates the specified resource on the FHIR server
   * @param {Resource} resource
   */
  public create(resource: DomainResource) {
    if (!resource.resourceType) {
      throw new Error('No resourceType is specified on the resource');
    }

    const url = `/api/fhir/${resource.resourceType}`;
    return this.http.post<DomainResource>(url, resource);
  }

  public transaction(bundle: IBundle) {
    return this.http.post<IBundle>('/api/fhir', bundle);
  }

  public batch(data: string, contentType: string, shouldRemovePermissions = true, applyContextPermissions = true) {
    let url = '/api/fhir?';

    if (applyContextPermissions) {
      url += 'applyContextPermissions=' + encodeURIComponent(applyContextPermissions) + '&';
    }

    return this.http.post<DomainResource>(url, data, {
      headers: {
        'Content-Type': contentType,
        'shouldRemovePermissions': shouldRemovePermissions.toString()
      }
    });
  }

  /*
  public validateOnServer(resource: DomainResource): Observable<OperationOutcome> {
    const url = `/api/fhir/${encodeURIComponent(resource.resourceType)}/$validate`;
    return this.http.post<OperationOutcome>(url, resource);
  }
   */

  public getFhirTooltip(fhirPath: string) {
    if (!fhirPath || fhirPath.indexOf('.') < 0 || !this.profiles) {
      return '';
    }

    const pathSplit = fhirPath.split('.');
    const resourceType = pathSplit[0];
    const structureDefinition = this.profiles.find((profile) => profile.id === resourceType);

    if (structureDefinition) {
      const definition = structureDefinition.snapshot || structureDefinition.differential;

      if (definition && definition.element) {
        const foundElement = (definition.element || []).find((element) => element.path === fhirPath);

        if (foundElement && foundElement.short) {
          return foundElement.short;
        }
      }
    }
  }

  /**
   * Validates the specified resource using the FHIR-JS module
   * @param {Resource} resource
   * @param extraData Extra data to be passed along to the custom validation logic
   * @return {any}
   */
  public validate(resource: Resource, extraData?: any): ValidatorResponse {
    if (!this.fhir) {
      return;
    }

    try {
      const results = this.fhir.validate(resource, {
        // inject custom validation into the FHIR module
        onBeforeValidateResource: (nextResource) => this.validateResource(nextResource, extraData)
        /*
        beforeCheckCode: (valueSetUrl: string, code: string, system?: string) => {
          if (system === 'https://trifolia-fhir.lantanagroup.com/security') {
            return true;
          } else if (code && this.validCodes.indexOf(code) >= 0) {
            return true;
          }

          return null;
        }
        */
      });

      // Remove any messages that are only information
      results.messages = (results.messages || []).filter((message) => message.severity !== Severities.Information);

      // Remove jurisdiction error
      results.messages = (results.messages || []).filter((message) => !(message.location.includes('jurisdiction')));

      // Update the "valid" property to account for custom validations
      results.valid = !(results.messages || []).find((message) => message.severity === Severities.Error);

      return results;
    } catch (ex) {
      return {
        valid: false,
        messages: [{
          severity: Severities.Error,
          message: `Internal error during validation: ${ex.message}\r\n${ex.stack}`,
          resourceId: resource.id
        }]
      };
    }
  }

  public serialize(resource: Resource) {
    if (!this.fhir) {
      return;
    }

    const xml = this.fhir.objToXml(resource);
    return vkbeautify.xml(xml);
  }

  public deserialize(resourceXml: string) {
    if (!this.fhir) {
      return;
    }

    return this.fhir.xmlToObj(resourceXml);
  }

  public getOperationOutcomeMessage(oo: OperationOutcome): string {
    if (oo.issue && oo.issue.length > 0) {
      const issues = oo.issue.map((issue: IssueComponent) => {
        if (issue.diagnostics) {
          return issue.diagnostics;
        } else if (issue.code) {
          return issue.code;
        } else {
          return issue.severity;
        }
      });
      return issues.join(', ');
    } else if (oo.text && oo.text.div) {
      return oo.text.div;
    }
  }

  /* public findResourceTypesWithSearchParam(searchParamName: string): string[] {
     const cs = <CapabilityStatement>this.configService.fhirResource;
     const resourceTypes: string[] = [];

     if (!cs) {
       return resourceTypes;
     }

     (cs.rest || []).forEach((rest: RestComponent) => {
       (rest.resource || []).forEach((resource: ResourceComponent) => {
         const found = (resource.searchParam || []).find((searchParam: SearchParamComponent) => searchParam.name === searchParamName);

         if (found) {
           resourceTypes.push(resource.type);
         }
       });
     });

     return resourceTypes;
   }*/

  public async checkUniqueId(resource: DomainResource) {
    let url = `/api/fhir/${resource.resourceType}`;
    url += `/${resource.id}`;
    url += `/$check-id`;

    return await this.http.get<boolean>(url).toPromise();
  }

  /**
   * Executed by the FHIR module. Performs custom validation on resources.
   * @param resource
   * @param extraData
   */
  private validateResource(resource: any, extraData?: any): ValidatorMessage[] {
    if (!this.customValidator) {
      return;
    }

    let additionalMessages = this.customValidator.validateResource(resource, extraData) || [];

    if (resource.resourceType === 'ImplementationGuide') {
      additionalMessages = additionalMessages.concat(this.customValidator.validateImplementationGuide(resource));
    }


    return additionalMessages;
  }
}
