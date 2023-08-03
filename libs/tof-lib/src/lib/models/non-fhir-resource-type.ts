//export type NonFhirResourceType = 'page'|'media'|'binary'|'other';

import { INonFhirResource } from ".";


export enum NonFhirResourceType {
    Other = "OtherNonFhirResource",

    Page = "Page",
    Media = "Media",
    Binary = "Binary",

    CdaExample = "CdaExample"
}


export interface ICdaExample extends INonFhirResource {}
