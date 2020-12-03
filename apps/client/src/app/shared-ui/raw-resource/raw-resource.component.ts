import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Resource} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirService} from '../../shared/fhir.service';
import {saveAs} from 'file-saver';
import * as vkbeautify from 'vkbeautify';

@Component({
    selector: 'app-raw-resource',
    templateUrl: './raw-resource.component.html',
    styleUrls: ['./raw-resource.component.css']
})
export class RawResourceComponent {
    @Input() shown?: boolean;
    @Input() resource: Resource;

    constructor(private fhirService: FhirService) {
    }

    public get baseFileName() {
        if (this.resource  && this.resource.id) {
            return this.resource.id;
        }

        return 'resource';
    }

    public downloadJson(event?) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const blob = new Blob([JSON.stringify(this.resource, null, '\t')], { type: 'application/json; charset=utf-8' });
        saveAs(blob, this.baseFileName + '.json');
    }

    public downloadXml(event?) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const resourceXml = this.fhirService.serialize(this.resource);
        const blob = new Blob([resourceXml], { type: 'text/xml; charset=utf-8' });
        saveAs(blob, this.baseFileName + '.xml');
    }

    public get xml() {
        if (!this.resource) {
            return;
        }

        const xml = this.fhirService.serialize(this.resource);

        return xml ? vkbeautify.xml(xml) : '';
    }
}
