import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { IFhirResource, INonFhirResource, IHistory, IProjectResource, IProjectResourceReference, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import {NonFhirResource, NonFhirResourceType, Page} from '@trifolia-fhir/models';
import {IBundle, IDomainResource, PageInfo} from '@trifolia-fhir/tof-lib';
import { Model } from 'mongoose';
import { BaseDataService } from '../base/base-data.service';
import { HistoryService } from '../history/history.service';
import { TofLogger } from '../tof-logger';
import {FhirResource, FhirResourceDocument} from './fhirResource.schema';
import { addToImplementationGuideNew, removeFromImplementationGuideNew } from '../helper';
import { ObjectId } from 'mongodb';
import { TofNotFoundException } from '../../not-found-exception';
import { LinkComponent, Binary as STU3Binary, Bundle as STU3Bundle, EntryComponent as STU3BundleEntryComponent } from '@trifolia-fhir/stu3';
import { Binary as R4Binary, Bundle as R4Bundle, BundleEntryComponent as R4BundleEntryComponent } from '@trifolia-fhir/r4';
import { Binary as R5Binary, Bundle as R5Bundle, BundleEntry as R5BundleEntryComponent } from '@trifolia-fhir/r5';

@Injectable()
export class FhirResourcesService extends BaseDataService<FhirResourceDocument> {

    protected readonly logger = new TofLogger(FhirResourcesService.name);


    constructor(
        @InjectModel(FhirResource.name) private fhirResourceModel: Model<FhirResourceDocument>,
        @InjectModel(NonFhirResource.name) private nonFhirResourceModel: Model<NonFhirResource>,
        private readonly historyService: HistoryService
    ) {
        super(fhirResourceModel);
    }



    public async createFhirResource(newFhirResource: IFhirResource, implementationGuideId?: string, isExample?: boolean): Promise<IFhirResource> {

        const lastUpdated = new Date();
        let versionId = 1;

        delete newFhirResource.id;
        delete newFhirResource['_id'];


        // validate FHIR resource
        // TODO: actually use FHIR validator
        if (!(newFhirResource.resource && newFhirResource.resource instanceof Object)) {
            throw new BadRequestException(`Invalid fhirResource resource provided.`);
        }

       // verify that the resource does not already exist
        let existing = await  this.findOne({'resource.resourceType': newFhirResource.resource.resourceType, 'resource.id' : newFhirResource.resource.id, 'referencedBy.value': new ObjectId(implementationGuideId)});
        if(existing)
        {
          throw new BadRequestException(`fhirResource resource already exists for this IG`);
        }
        // ensure meta version ID and lastUpdated are set
        if (!newFhirResource.resource.meta) {
          newFhirResource.resource.meta = {};
        }
        delete newFhirResource.resource.meta['security'];
        newFhirResource.resource.meta.versionId = versionId.toString();
        newFhirResource.resource.meta.lastUpdated = lastUpdated;
        newFhirResource.versionId = versionId;
        newFhirResource.isDeleted = false;
        newFhirResource.lastUpdated = lastUpdated;

        if (newFhirResource.resource.resourceType !== 'ImplementationGuide' && implementationGuideId) {
          newFhirResource.referencedBy = newFhirResource.referencedBy || [];
            let obj = newFhirResource.referencedBy.find(referenced => referenced.value === implementationGuideId)
            if (obj == null) {
              newFhirResource.referencedBy.push({'value':implementationGuideId, 'valueType' : 'FhirResource'});
            }
        }

        if(!newFhirResource.resource.id){
          newFhirResource.resource.id = new ObjectId().toHexString();
        }

      newFhirResource = await this.fhirResourceModel.create(newFhirResource);

        let newHistory: IHistory = {
            content: newFhirResource.resource,
            versionId: versionId,
            lastUpdated: lastUpdated,
            current: { value: newFhirResource.id, valueType: 'FhirResource'}
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (newFhirResource.resource.resourceType !== 'ImplementationGuide' && implementationGuideId) {
            await addToImplementationGuideNew(this, newFhirResource, implementationGuideId, isExample);
        }

        return newFhirResource;
    }


    public async updateFhirResource(id: string, upFhirResource: IFhirResource, implementationGuideId?: string, isExample?: boolean): Promise<IFhirResource> {

        const lastUpdated = new Date();
        let versionId: number = 1;

        if (upFhirResource.id && upFhirResource.id !== id) {
            throw new BadRequestException();
        }

        let existing = await this.fhirResourceModel.findById(id);

        if (!existing) {
            throw new TofNotFoundException();
        }

        // most likely isn't empty, but...
        if (!existing.resource) {
            existing.resource = <IDomainResource>{};
        }

        // validate FHIR resource
        // TODO: actually use FHIR validator
        if (!(upFhirResource.resource && upFhirResource.resource instanceof Object)) {
            throw new BadRequestException(`Invalid fhirResource resource provided.`);
        }


        // ensure we have a resource metadata object
        if (!existing.resource.meta) {
            existing.resource.meta = {};
        }

        // default to using existing version+1 if present
        if (existing.versionId) {
            versionId = existing.versionId + 1;
        }
        // otherwise check resource meta
        else if (existing.resource.meta.versionId) {
            versionId = parseInt(existing.resource.meta.versionId) + 1;
        } else {
            versionId = 1;
        }


        // check for any added or removed references if this is an implementation guide
        if (existing.resource.resourceType === 'ImplementationGuide') {


            // references removed -- references in existing but not in updated
            let fhirResIdsRemoved: ObjectId[] = [];
            let nonFhirResIdsRemoved: ObjectId[] = [];


            if (existing.references && existing.references.length > 0) {
                existing.references.forEach((exRef: IProjectResourceReference) => {

                    let exRefId: ObjectId = (typeof exRef.value === typeof '') ?
                        new ObjectId(<string>exRef.value) : new ObjectId((<IProjectResource>exRef.value).id);

                    if (!(upFhirResource.references || []).find(
                        (upRef: IProjectResourceReference) => {
                            let upRefId: ObjectId = (typeof upRef.value === typeof '') ?
                                new ObjectId(<string>upRef.value) : new ObjectId((<IProjectResource>upRef.value).id);
                            upRef.value = upRefId.toString();

                            return upRefId.equals(exRefId) && upRef.valueType === exRef.valueType;
                        }
                    )) {
                        if (exRef.valueType == 'NonFhirResource') {
                            nonFhirResIdsRemoved.push(exRefId);
                        } else {
                            fhirResIdsRemoved.push(exRefId);
                        }
                    }
                });
            }

            // references added -- references not in existing but in updated
            let fhirResIdsAdded: ObjectId[] = [];
            let nonFhirIdsAdded: ObjectId[] = [];
            if (upFhirResource.references && upFhirResource.references.length > 0) {
               upFhirResource.references.forEach((upRef: IProjectResourceReference) => {
                    let upRefId: ObjectId = (typeof upRef.value === typeof '') ?
                        new ObjectId(<string>upRef.value) : new ObjectId((<IProjectResource>upRef.value).id);
                    upRef.value = upRefId.toString();

                    if (!(existing.references || []).find(
                        (exRef: IProjectResourceReference) => {
                            let exRefId: ObjectId = (typeof exRef.value === typeof '') ?
                                new ObjectId(<string>exRef.value) : new ObjectId((<IProjectResource>exRef.value).id);

                            return exRefId.equals(upRefId) && exRef.valueType === upRef.valueType;
                        }
                    )) {
                        if (upRef.valueType == 'NonFhirResource') {
                            nonFhirIdsAdded.push(upRefId);
                        }
                        else {
                          fhirResIdsAdded.push(upRefId);
                        }

                    }

                });

            }

            if (fhirResIdsRemoved && fhirResIdsRemoved.length > 0) {
                await this.fhirResourceModel.updateMany(
                    { '_id': { $in: fhirResIdsRemoved } },
                    { $pull: { referencedBy: {value: existing.id, valueType: 'FhirResource' } } }
                );
            }

            if (nonFhirResIdsRemoved && nonFhirResIdsRemoved.length > 0) {
                await this.nonFhirResourceModel.updateMany(
                    { '_id': { $in: nonFhirResIdsRemoved } },
                    { $pull: { referencedBy: {value: existing.id, valueType: 'FhirResource' } } }
                );
            }

            if (fhirResIdsAdded && fhirResIdsAdded.length > 0) {
                await this.fhirResourceModel.updateMany(
                    { '_id': { $in: fhirResIdsAdded } },
                    { $pull: { referencedBy: {value: existing.id, valueType: 'FhirResource' } } }
                );
            }
            if (nonFhirIdsAdded && nonFhirIdsAdded.length > 0) {
                await this.nonFhirResourceModel.updateMany(
                    { '_id': { $in: nonFhirIdsAdded } },
                    { $push: { referencedBy: {value: existing.id, valueType: 'FhirResource' } } }
                );
            }

        }


        // update every property supplied from updated object
        for (let key in upFhirResource) {
            existing[key] = upFhirResource[key];
        }

        // set version and timestamp
        if (existing.resource.meta) {
          delete existing.resource.meta['security'];
          existing.resource.meta.versionId = versionId.toString();
          existing.resource.meta.lastUpdated = lastUpdated;
        }
        existing.versionId = versionId;
        existing.lastUpdated = lastUpdated;
        existing.isDeleted = false;
        await this.fhirResourceModel.findByIdAndUpdate(existing.id, existing, { new: true });


        let newHistory: IHistory = {
            content: existing.resource,
            versionId: versionId,
            lastUpdated: lastUpdated,
            current: { value: existing.id, valueType: 'FhirResource'}
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (existing.resource.resourceType !== 'ImplementationGuide' && implementationGuideId) {
            await addToImplementationGuideNew(this, existing, implementationGuideId, isExample);
        }


        return existing;

    }

    public async deleteFhirResource(id: string): Promise<IFhirResource> {
        // remove from IG
        let resource = await super.findById(id);
        await removeFromImplementationGuideNew(this, resource);
        resource.isDeleted= true;
        return super.updateOne(resource.id, resource);
    }


    public async getWithReferences(fhirResourceId: string) {
        return this.fhirResourceModel.findById(fhirResourceId).populate('references.value');
    }


    /**
     * Returns a FHIR Bundle with the IG and its referenced resources
     * @param implementationGuideId Database ID of the fhirResources resource for the implementation guide
     * @returns FHIR Bundle containing the IG resource and all referenced resources
     */
    public async getBundleFromImplementationGuideId(implementationGuideId: string): Promise<IBundle> {
        const fhirResource: IFhirResource = await this.getWithReferences(implementationGuideId);
        return this.getBundleFromImplementationGuide(fhirResource);
    }

    /**
     * Returns a FHIR Bundle with the requested IG and its referenced resources
     * @param implementationGuide Cnformance resource representation of the implementation guide
     * @returns FHIR Bundle containing the IG resource and all referenced resources
     */
    public async getBundleFromImplementationGuide(implementationGuide: IFhirResource): Promise<IBundle> {

        if (!implementationGuide || !implementationGuide.resource || implementationGuide.resource.resourceType !== 'ImplementationGuide') {
            throw new TofNotFoundException(`No valid implementation guide found.`);
        }

        let referenceMap = this.getReferenceMap(implementationGuide);

        let bundle: IBundle;
        let entryType;
        if (implementationGuide.fhirVersion === 'stu3') {
            bundle = new STU3Bundle(implementationGuide);
            entryType = STU3BundleEntryComponent;
        } else if (implementationGuide.fhirVersion === 'r4') {
            bundle = new R4Bundle(implementationGuide);
            entryType = R4BundleEntryComponent;
        }
        else {
            bundle = new R5Bundle(implementationGuide);
            entryType = R5BundleEntryComponent;
        }

        bundle.entry = [];

        let igEntry: STU3BundleEntryComponent | R4BundleEntryComponent | R5BundleEntryComponent = new entryType();
        igEntry.resource = implementationGuide.resource;
        bundle.entry.push(igEntry);
        (implementationGuide.references || []).forEach((r: IProjectResourceReference) => {
            let entry: STU3BundleEntryComponent | R4BundleEntryComponent | R5BundleEntryComponent = new entryType();

            if (!r.value) {
                return;
            }

            if (r.valueType === 'FhirResource') {
                entry.resource = r.value['resource'];
            }
            else if (r.valueType === 'NonFhirResource') {
                // attempt to parse content for fhir resource... otherwise create a binary type for the content
                try {
                    if (typeof r.value['content'] !== typeof '') {
                        r.value['content'] = JSON.stringify(r.value['content']);
                    }
                    entry.resource = JSON.parse(r.value['content']);
                } catch (error) {
                    let newBinary;//: STU3Binary|R4Binary|R5Binary;
                    //let encoded: string = Buffer.from(r.value['content']).toString('base64');
                    //console.log('encoded:', encoded);
                    if (implementationGuide.fhirVersion === 'stu3') {
                        newBinary = new STU3Binary();
                        newBinary.content = r.value['content'];
                    } else if (implementationGuide.fhirVersion === 'r4') {
                        newBinary = new R4Binary();
                        newBinary.data = r.value['content'];
                    } else {
                        newBinary = new R5Binary();
                        newBinary.data = r.value['content'];
                    }

                    newBinary.id = r.value['name'] ? r.value['name'] : r.value['id'];
                    newBinary.contentType = 'application/xml';
                    entry.link = [new LinkComponent({ relation: 'example-cda' })];
                    entry.resource = newBinary;
                }

            }

            if (entry.resource) {
                bundle.entry.push(entry);
            }
        });



        return bundle;

    }


  public async getPagesFromImplementationGuide(implementationGuide: IFhirResource): Promise<Page[]> {

    let  pages: Page[] = [];

    if (!implementationGuide || !implementationGuide.resource || implementationGuide.resource.resourceType !== 'ImplementationGuide') {
      throw new TofNotFoundException(`No valid implementation guide found.`);
    }

    (implementationGuide.references || []).forEach((r: IProjectResourceReference) => {

      if (!r.value) {
        return;
      }
      if (r.valueType === 'NonFhirResource') {
         if (r.value["type"] === NonFhirResourceType.Page) {
           let page = new Page();
           page = <Page>r.value;
           pages.push(page);
         }
      }

    });

    return pages;

  }


    public getReferenceMap(fhirResource: IFhirResource): IProjectResourceReferenceMap {

        let map: IProjectResourceReferenceMap = {};
        (fhirResource.references || []).forEach((r: IProjectResourceReference) => {
            if (!r.value || typeof r.value === typeof '') return;

            let key: string;
            if (r.valueType === 'FhirResource') {
                const val: IFhirResource = <IFhirResource>r.value;
                key = `${val.resource.resourceType}/${val.resource.id ?? val.id}`;
            }
            else if (r.valueType === 'NonFhirResource') {
                const val: INonFhirResource = <INonFhirResource>r.value;
                if (typeof val.content === typeof {} && 'resourceType' in val.content && 'id' in val.content) {
                    key = `${val.content['resourceType']}/${val.content['id'] ?? val.id}`;
                }
                else {
                    key = `Binary/${val.name || val.content['id'] || val.id}`;
                }
            }

            if (key) {
                const newProjectResourceReference: IProjectResourceReference = { value: r.value['id'], valueType: r.valueType };
                map[key] = newProjectResourceReference;
            }
        });

        return map;

    }

}
