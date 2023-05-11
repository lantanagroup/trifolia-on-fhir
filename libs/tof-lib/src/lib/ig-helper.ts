import { getR4Dependencies, getSTU3Dependencies } from "./fhirHelper";
import { ICoding, IImplementationGuide } from "./fhirInterfaces";
import { IConformance } from "./models";
import {ImplementationGuide as R4ImplementationGuide} from './r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide} from './stu3/fhir';

export class ImplementationGuideContext {
    implementationGuideId: string;
    name?: string;
    securityTags?: ICoding[];
    dependencies?: string[];
}


export function getImplementationGuideContext(igConformance: IConformance): ImplementationGuideContext {

    const ig = <IImplementationGuide>igConformance.resource;

    return {
        implementationGuideId: igConformance.id,
        name: ig.name,
        securityTags: ig.meta && ig.meta.security ? ig.meta.security : [],
        dependencies: igConformance.fhirVersion === 'stu3' ? getSTU3Dependencies(<STU3ImplementationGuide>ig) : getR4Dependencies(<R4ImplementationGuide>ig)
    }
}