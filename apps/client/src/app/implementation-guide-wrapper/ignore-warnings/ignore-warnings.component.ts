import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IDocumentReference, IImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {codeableConceptHasCode, generateId, getIgnoreWarningsValue} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'trifolia-fhir-ignore-warnings',
  templateUrl: './ignore-warnings.component.html',
  styleUrls: ['./ignore-warnings.component.css']
})
export class IgnoreWarningsComponent implements OnInit, OnChanges {
  @Input() implementationGuide: IImplementationGuide;
  @Output() change = new EventEmitter<string>();
  public valueChanged = new EventEmitter();
  public value: string;

  constructor() {
    this.valueChanged
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.updateIgnoreWarningsValue();
        this.change.emit(this.value);
      });
  }

  public updateIgnoreWarningsValue() {
    if (!this.implementationGuide) return;

    this.implementationGuide.extension = this.implementationGuide.extension || [];
    let foundExtension = this.implementationGuide.extension.find(e => e.url === Globals.extensionUrls['extension-ig-ignore-warnings']);
    let foundContained = foundExtension && foundExtension.valueReference && foundExtension.valueReference.reference ?
      this.implementationGuide.contained.find(c => c.id === foundExtension.valueReference.reference.substring(1)) :
      null;

    if (!this.value) {
      if (foundExtension) {
        const foundExtensionIndex = this.implementationGuide.extension.indexOf(foundExtension);
        this.implementationGuide.extension.splice(foundExtensionIndex, foundExtensionIndex >= 0 ? 1 : 0);
      }

      if (foundContained) {
        const foundContainedIndex = this.implementationGuide.contained.indexOf(foundContained);
        this.implementationGuide.contained.splice(foundContainedIndex, foundContainedIndex >= 0 ? 1 : 0);
      }
    } else {
      if (!foundExtension) {
        foundExtension = {
          url: Globals.extensionUrls['extension-ig-ignore-warnings'],
          valueReference: {
            reference: `#${generateId()}`
          }
        };
        this.implementationGuide.extension.push(foundExtension);
      }

      this.implementationGuide.contained = this.implementationGuide.contained || [];

      if (!foundContained) {
        foundContained = <IDocumentReference> {
          resourceType: 'DocumentReference',
          id: foundExtension.valueReference.reference.substring(1),
          type: {
            coding: [{
              code: 'ignore-warnings'
            }]
          },
          content: [{
            attachment: {
              contentType: 'text/plain',
              title: 'ignoreWarnings.txt',
              data: btoa(this.value)
            }
          }]
        };
        this.implementationGuide.contained.push(foundContained);
      } else {
        const docRef = <IDocumentReference> foundContained;
        docRef.content[0].attachment.data = btoa(this.value);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.value = getIgnoreWarningsValue(this.implementationGuide);
  }

  ngOnInit() {
    this.value = getIgnoreWarningsValue(this.implementationGuide);
  }
}
