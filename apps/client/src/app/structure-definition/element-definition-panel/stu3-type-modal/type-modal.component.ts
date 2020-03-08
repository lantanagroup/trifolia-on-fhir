import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../../libs/tof-lib/src/lib/globals';
import {FhirService} from '../../../shared/fhir.service';
import {Coding, TypeRefComponent} from '../../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirReferenceModalComponent} from '../../../fhir-edit/reference-modal/reference-modal.component';
import {ConfigService} from '../../../shared/config.service';
import {IElement} from '../../../../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Component({
  templateUrl: './type-modal.component.html',
  styleUrls: ['./type-modal.component.css']
})
export class STU3TypeModalComponent implements OnInit {
  @Input() element: any;
  @Input() type: TypeRefComponent;
  public definedTypeCodes: Coding[] = [];

  public Globals = Globals;

  constructor(
    public activeModal: NgbActiveModal,
    public configService: ConfigService,
    protected modalService: NgbModal,
    protected fhirService: FhirService) {

  }

  selectProfile(dest: string) {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, {size: 'lg'});
    modalRef.componentInstance.resourceType = 'StructureDefinition';
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((results) => {
      this.type[dest] = results.resource.url;
    });
  }

  get profileElement(): string {
    if (!this.type._profile) return '';

    const profileInfo = <IElement> this.type._profile;
    const found = (profileInfo.extension || []).find(e => e.url === Globals.extensionUrls['elementdefinition-profile-element']);

    if (!found) return '';

    return found.valueString;
  }

  set profileElement(value: string) {
    if (!this.type._profile) this.type._profile = {};
    const profileInfo = <IElement> this.type._profile;
    profileInfo.extension = profileInfo.extension || [];
    let found = profileInfo.extension.find(e => e.url === Globals.extensionUrls['elementdefinition-profile-element']);

    if (!found) {
      found = {
        url: Globals.extensionUrls['elementdefinition-profile-element']
      };
      profileInfo.extension.push(found);
    }

    if (value) {
      found.valueString = value;
    } else {
      const foundIndex = profileInfo.extension.indexOf(found);
      profileInfo.extension.splice(foundIndex, foundIndex >= 0 ? 1 : 0);

      if (profileInfo.extension.length === 0) delete profileInfo.extension;
      if (Object.keys(profileInfo).length === 0) delete this.type._profile;
    }
  }

  ngOnInit() {
    this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
  }
}
