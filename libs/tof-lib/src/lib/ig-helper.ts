import { getR4Dependencies, getSTU3Dependencies } from "./fhirHelper";
import { ICoding, IImplementationGuide } from "./fhirInterfaces";
import { IFhirResource } from "./models";
import {ImplementationGuide as R4ImplementationGuide} from './r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide} from './stu3/fhir';

export class ImplementationGuideContext {
    implementationGuideId?: string;
    fhirVersion?: 'stu3'|'r4'|'r5' = 'r4';
    name?: string;
    securityTags?: ICoding[];
    dependencies?: string[];
}


export function getImplementationGuideContext(igConformance: IFhirResource): ImplementationGuideContext {

    const ig = <IImplementationGuide>igConformance.resource;

    return {
        implementationGuideId: igConformance.id,
        fhirVersion: igConformance.fhirVersion,
        name: ig.name,
        securityTags: ig.meta && ig.meta.security ? ig.meta.security : [],
        dependencies: igConformance.fhirVersion === 'stu3' ? getSTU3Dependencies(<STU3ImplementationGuide>ig) : getR4Dependencies(<R4ImplementationGuide>ig)
    }
}
