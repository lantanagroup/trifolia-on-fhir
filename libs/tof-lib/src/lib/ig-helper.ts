import { getR4Dependencies, getSTU3Dependencies } from "./fhirHelper";
import { IImplementationGuide } from "./fhirInterfaces";
import { IFhirResource, IPermission } from "./models";
import {ImplementationGuide as R4ImplementationGuide} from './r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide} from './stu3/fhir';

export class ImplementationGuideContext {
    implementationGuideId?: string;
    projectIds?: string[];
    fhirVersion?: 'stu3'|'r4'|'r5' = 'r4';
    name?: string;
    dependencies?: string[];
}


export function getImplementationGuideContext(igfhirResource: IFhirResource): ImplementationGuideContext {

    const ig = <IImplementationGuide>igfhirResource.resource;

    return {
        implementationGuideId: igfhirResource.id,
        projectIds: (igfhirResource.projects || []).map(p => typeof p === typeof {} && 'id' in p ? p['id'] : p?.toString()),
        fhirVersion: igfhirResource.fhirVersion,
        name: ig.name,
        dependencies: igfhirResource.fhirVersion === 'stu3' ? getSTU3Dependencies(<STU3ImplementationGuide>ig) : getR4Dependencies(<R4ImplementationGuide>ig)
    }
}
