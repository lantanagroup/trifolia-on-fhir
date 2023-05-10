import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IConformance, IExample, IHistory, IProject, IProjectResourceReference, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import { IBundle, IDomainResource } from '@trifolia-fhir/tof-lib';
import { Model } from 'mongoose';
import { BaseDataService } from '../base/base-data.service';
import { HistoryService } from '../history/history.service';
import { TofLogger } from '../tof-logger';
import { Conformance, ConformanceDocument } from './conformance.schema';
import { addToImplementationGuideNew, removeFromImplementationGuideNew } from '../helper';
import { ObjectId } from 'mongodb';
import { TofNotFoundException } from '../../not-found-exception';
import { LinkComponent, Binary as STU3Binary, Bundle as STU3Bundle, EntryComponent as STU3BundleEntryComponent } from '@trifolia-fhir/stu3';
import { Binary as R4Binary, Bundle as R4Bundle, BundleEntryComponent as R4BundleEntryComponent } from '@trifolia-fhir/r4';
import { Binary as R5Binary, Bundle as R5Bundle, BundleEntry as R5BundleEntryComponent } from '@trifolia-fhir/r5';

@Injectable()
export class ConformanceService extends BaseDataService<ConformanceDocument> {

    protected readonly logger = new TofLogger(ConformanceService.name);


    constructor(
        @InjectModel(Conformance.name) private conformanceModel: Model<ConformanceDocument>,
        private readonly historyService: HistoryService
    ) {
        super(conformanceModel);
    }



    public async createConformance(newConf: IConformance, implementationGuideId?: string): Promise<IConformance> {

        const lastUpdated = new Date();
        let versionId = 1;

        delete newConf.id;
        delete newConf['_id'];


        // validate FHIR resource
        // TODO: actually use FHIR validator
        if (!(newConf.resource && newConf.resource instanceof Object)) {
            throw new BadRequestException(`Invalid conformance resource provided.`);
        }

        // ensure meta version ID and lastUpdated are set
        if (!newConf.resource.meta) {
            newConf.resource.meta = {};
        }
        delete newConf.resource.meta['security'];
        newConf.resource.meta.versionId = versionId.toString();
        newConf.resource.meta.lastUpdated = lastUpdated;
        newConf.versionId = versionId;
        newConf.lastUpdated = lastUpdated;

        if (newConf.resource.resourceType !== 'ImplementationGuide' && implementationGuideId) {
            newConf.igIds = newConf.igIds || [];
            if (newConf.igIds.indexOf(implementationGuideId) < 0) {
                newConf.igIds.push(implementationGuideId);
            }
        }

        if(!newConf.resource.id){
           newConf.resource.id = new ObjectId().toHexString();
          //newConf.resource.id = Math.floor(Math.random() * Date.now()).toString(16);
        }

        newConf = await this.conformanceModel.create(newConf);

        let newHistory: IHistory = {
            content: newConf.resource,
            versionId: versionId,
            lastUpdated: lastUpdated,
            targetId: newConf.id,
            type: 'conformance'
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (newConf.resource.resourceType !== 'ImplementationGuide' && implementationGuideId) {
            await addToImplementationGuideNew(this, newConf, implementationGuideId);
        }

        return newConf;
    }


    public async updateConformance(id: string, upConf: IConformance, implementationGuideId?: string): Promise<IConformance> {

        const lastUpdated = new Date();
        let versionId: number = 1;

        if (upConf.id && upConf.id !== id) {
            throw new BadRequestException();
        }

        let existing = await this.conformanceModel.findById(id);

        if (!existing) {
            throw new NotFoundException();
        }

        // most likely isn't empty, but...
        if (!existing.resource) {
            existing.resource = <IDomainResource>{};
        }

        // validate FHIR resource
        // TODO: actually use FHIR validator
        if (!(upConf.resource && upConf.resource instanceof Object)) {
            throw new BadRequestException(`Invalid conformance resource provided.`);
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
            let confIdsRemoved: ObjectId[] = [];
            if (existing.references && existing.references.length > 0) {
                existing.references.forEach((exRef: IProjectResourceReference) => {

                    let exRefId: ObjectId = (typeof exRef.value === typeof '') ?
                        new ObjectId(<string>exRef.value) : new ObjectId((<IConformance>exRef.value).id);

                    if (!(upConf.references || []).find(
                        (upRef: IProjectResourceReference) => {
                            let upRefId: ObjectId = (typeof upRef.value === typeof '') ?
                                new ObjectId(<string>upRef.value) : new ObjectId((<IConformance>upRef.value).id);

                            return upRefId.equals(exRefId) && upRef.valueType === exRef.valueType;
                        }
                    )) {
                        confIdsRemoved.push(exRefId);
                    }
                });
            }

            // references added -- references not in existing but in updated
            let confIdsAdded: ObjectId[] = [];
            if (upConf.references && upConf.references.length > 0) {
                upConf.references.forEach((upRef: IProjectResourceReference) => {
                    let upRefId: ObjectId = (typeof upRef.value === typeof '') ?
                        new ObjectId(<string>upRef.value) : new ObjectId((<IConformance>upRef.value).id);

                    if (!(existing.references || []).find(
                        (exRef: IProjectResourceReference) => {
                            let exRefId: ObjectId = (typeof exRef.value === typeof '') ?
                                new ObjectId(<string>exRef.value) : new ObjectId((<IConformance>exRef.value).id);

                            return exRefId.equals(upRefId) && exRef.valueType === upRef.valueType;
                        }
                    )) {
                        confIdsAdded.push(upRefId);
                    }

                });

            }

            //console.log('confIdsRemoved:', confIdsRemoved);
            //console.log('confIdsAdded:', confIdsAdded);

            await this.conformanceModel.updateMany(
                { '_id': { $in: confIdsRemoved } },
                { $pull: { igIds: existing.id } }
            );

            await this.conformanceModel.updateMany(
                { '_id': { $in: confIdsAdded } },
                { $push: { igIds: existing.id } }
            );

        }


        // update every property supplied from updated object
        for (let key in upConf) {
            existing[key] = upConf[key];
        }

        // set version and timestamp
        delete existing.resource.meta['security'];
        existing.resource.meta.versionId = versionId.toString();
        existing.resource.meta.lastUpdated = lastUpdated;
        existing.versionId = versionId;
        existing.lastUpdated = lastUpdated;

        await this.conformanceModel.findByIdAndUpdate(existing.id, existing, { new: true });


        let newHistory: IHistory = {
            content: existing.resource,
            versionId: versionId,
            lastUpdated: lastUpdated,
            targetId: existing.id,
            type: 'conformance'
        }

        await this.historyService.create(newHistory);

        //Add it to the implementation Guide
        if (existing.resource.resourceType !== 'ImplementationGuide' && implementationGuideId) {
            await addToImplementationGuideNew(this, existing, implementationGuideId);
        }

        return existing;

    }

    public async deleteConformance(id: string): Promise<IConformance> {
        // remove from IG
        let resource = await super.findById(id);
        await removeFromImplementationGuideNew(this, resource);
        return super.delete(id);
    }


    public async getWithReferences(conformanceId: string) {
        return this.conformanceModel.findById(conformanceId).populate('references.value');
    }


    /**
     * Returns a FHIR Bundle with the IG and its referenced resources
     * @param implementationGuideId Database ID of the conformance resource for the implementation guide
     * @returns FHIR Bundle containing the IG resource and all referenced resources
     */
    public async getBundleFromImplementationGuideId(implementationGuideId: string): Promise<IBundle> {
        const conformance: IConformance = await this.getWithReferences(implementationGuideId);
        return this.getBundleFromImplementationGuide(conformance);
    }

    /**
     * Returns a FHIR Bundle with the requested IG and its referenced resources
     * @param implementationGuide Cnformance resource representation of the implementation guide
     * @returns FHIR Bundle containing the IG resource and all referenced resources
     */
    public async getBundleFromImplementationGuide(implementationGuide: IConformance): Promise<IBundle> {

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

        let igEntry: STU3BundleEntryComponent|R4BundleEntryComponent|R5BundleEntryComponent = new entryType();
        igEntry.resource = implementationGuide.resource;
        bundle.entry.push(igEntry);

        (implementationGuide.references || []).forEach((r: IProjectResourceReference) => {
            let entry: STU3BundleEntryComponent|R4BundleEntryComponent|R5BundleEntryComponent = new entryType();

            if (!r.value) {
                return;
            }

            if (r.valueType === 'Conformance') {
                entry.resource = r.value['resource'];
            }
            else if (r.valueType === 'Example') {
                // attempt to parse content for fhir resource... otherwise create a binary type for the content
                try {
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

                    newBinary.id = r.value['name'];
                    newBinary.contentType = 'application/xml';
                    entry.link = [new LinkComponent({relation: 'example-cda'})];
                    entry.resource = newBinary;
                }

            }

            if (entry.resource) {
                bundle.entry.push(entry);
            }
        });


        return bundle;

    }


    public getReferenceMap(conformance: IConformance): IProjectResourceReferenceMap {

        let map: IProjectResourceReferenceMap = {};
        (conformance.references || []).forEach((r: IProjectResourceReference) => {
            if (!r.value || typeof r.value === typeof '') return;

            let key: string;
            if (r.valueType === 'Conformance') {
                const val: IConformance = <IConformance>r.value;
                key = `${val.resource.resourceType}/${val.resource.id ?? val.id}`;
            }
            else if (r.valueType === 'Example') {
                const val: IExample = <IExample>r.value;
                if (typeof val.content === typeof {} && 'resourceType' in val.content && 'id' in val.content) {
                    key = `${val.content['resourceType']}/${val.content['id'] ?? val.id}`;
                }
                else {
                    key = `example/${val.content['id'] ?? val.id}`;
                }
            }

            if (key) {
                map[key] = r;
            }
        });

        return map;

    }

}
