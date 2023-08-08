//export type NonFhirResourceType = 'page'|'media'|'binary'|'other';

import { INonFhirResource, IPermission, IProject, IProjectResourceReference } from ".";


export enum NonFhirResourceType {
    OtherNonFhirResource = "OtherNonFhirResource",

    Page = "Page",
    Media = "Media",
    Binary = "Binary",

    CdaExample = "CdaExample"
}


export abstract class NonFhirResource implements INonFhirResource {

    constructor(initialValues?: object) {
        for (const key in initialValues) {
            this[key] = initialValues[key];
        }
    }

    id?: string;
    content?: any;
    name?: string;
    description?: string;
    projects?: IProject[];
    migratedFrom?: string;
    versionId: number;
    lastUpdated: Date;
    permissions?: IPermission[];
    referencedBy?: IProjectResourceReference[];
    references?: IProjectResourceReference[];
    isDeleted?: boolean;
    type: NonFhirResourceType;

}


export class CdaExample extends NonFhirResource {
    readonly type: NonFhirResourceType = NonFhirResourceType.CdaExample;
}

export class OtherNonFhirResource extends NonFhirResource {
    readonly type: NonFhirResourceType = NonFhirResourceType.OtherNonFhirResource;
}
