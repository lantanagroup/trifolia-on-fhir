import {Injectable} from '@angular/core';
import {saveAs} from 'file-saver';
import {FhirService} from './fhir.service';
import {FileModel} from '../models/file-model';
import {Router} from '@angular/router';
import * as vkbeautify from 'vkbeautify';

// Used by the "open" button to set the resource that is being opened from the file system
@Injectable()
export class FileService {
    public file: FileModel;

    constructor(
        private router: Router,
        private fhirService: FhirService) {
    }

    public loadFile(file: FileModel) {
        const resource = file.resource;
        let navLocation;

        switch (resource.resourceType) {
            case 'CapabilityStatement':
                navLocation = '/capability-statement/from-file';
                break;
            case 'ImplementationGuide':
                navLocation = '/implementation-guide/from-file';
                break;
            case 'ValueSet':
                navLocation = '/value-set/from-file';
                break;
            case 'CodeSystem':
                navLocation = '/code-system/from-file';
                break;
            case 'OperationDefinition':
                navLocation = '/operation-definition/from-file';
                break;
            case 'StructureDefinition':
                navLocation = '/structure-definition/from-file';
                break;
            default:
                alert('Cannot edit resource type ' + resource.resourceType);
                break;
        }

        this.file = file;
      // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([navLocation]);
    }

    public saveFile() {
        let content: string = JSON.stringify(this.file.resource, null, '\t');
        const contentType = this.file.isXml ? 'application/xml' : 'application/json';

        if (this.file.isXml) {
            content = this.fhirService.serialize(this.file.resource);
            content = vkbeautify.xml(content);
        }

        const contentBlob = new Blob([content], {type: contentType});
        saveAs(contentBlob, this.file.name);
    }
}
