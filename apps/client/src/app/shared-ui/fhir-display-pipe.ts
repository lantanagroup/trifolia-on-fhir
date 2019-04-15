import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'fhirDisplay'})
export class FhirDisplayPipe implements PipeTransform {
    transform(value, args: string[]): any {
        let typeDisplay = '';

        switch (value.resourceType) {
            case 'AuditEvent':
                typeDisplay = 'Audit Event';
                break;
            case 'ImplementationGuide':
                typeDisplay = 'Implementation Guide';
                break;
            case 'StructureDefinition':
                typeDisplay = 'Structure Definition';
                break;
            default:
                typeDisplay = value.resourceType;
                break;
        }

        switch (value.resourceType) {
            case 'Patient':
            case 'Practitioner':
                let name = '';

                if (value.name.length > 0) {
                    if (value.name[0].family && value.name[0].given && value.name[0].given.length > 0) {
                        name = value.name[0].given.join(' ') + ' ' + value.name[0].family;
                    } else if (value.name[0].family) {
                        name = value.name[0].family;
                    } else if (value.name[0].given) {
                        name = value.name[0].given.join(' ');
                    }
                }

                return typeDisplay + ' ' + (name ? name : value.id);
            default:
                return (value.name || value.title || value.id);
        }
    }
}
