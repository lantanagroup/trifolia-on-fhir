import * as vkbeautify from 'vkbeautify';
import { Pipe, PipeTransform } from '@angular/core';
import {FhirService} from '../services/fhir.service';

@Pipe({
    name: 'fhirXml'
})
export class FhirXmlPipe implements PipeTransform {
    constructor(private fhirService: FhirService) {

    }

    transform(value: any): string {
        const fhirXml = this.fhirService.serialize(value);

        if (fhirXml) {
            return vkbeautify.xml(fhirXml);
        }

        return '';
    }
}