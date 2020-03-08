import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../../libs/tof-lib/src/lib/globals';
import {FhirService} from '../../../shared/fhir.service';
import {Coding, ElementDefinitionTypeRefComponent} from '../../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {FhirReferenceModalComponent} from '../../../fhir-edit/reference-modal/reference-modal.component';
import {ConfigService} from '../../../shared/config.service';
import {IElement} from '../../../../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Component({
  templateUrl: './type-modal.component.html',
  styleUrls: ['./type-modal.component.css']
})
export class R4TypeModalComponent implements OnInit {
  @Input() element: any;
  @Input() type: ElementDefinitionTypeRefComponent;

  public definedTypeCodes: Coding[] = [];
  public Globals = Globals;

  constructor(
    public activeModal: NgbActiveModal,
    public configService: ConfigService,
    protected modalService: NgbModal,
    protected fhirService: FhirService) {

  }

  public selectProfile(array: string[], index: number) {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, {size: 'lg'});
    modalRef.componentInstance.resourceType = 'StructureDefinition';
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((results) => {
      array[index] = results.resource.url;
    });
  }

  public addProfile() {
    if (!this.type.profile) {
      this.type.profile = [];
    }

    this.type.profile.push('');
  }

  public addTargetProfile() {
    if (!this.type.targetProfile) {
      this.type.targetProfile = [];
    }

    this.type.targetProfile.push('');
  }

  public addAggregation() {
    if (!this.type.aggregation) {
      this.type.aggregation = [];
    }

    this.type.aggregation.push('');
  }

  getProfileElement(profileIndex: number) {
    if (!this.type._profile || !this.type._profile[profileIndex]) return '';

    const profileInfo = <IElement> this.type._profile[profileIndex];
    const found = (profileInfo.extension || []).find(e => e.url === Globals.extensionUrls['elementdefinition-profile-element']);

    if (found) {
      return found.valueString;
    }

    return '';
  }

  setProfileElement(profileIndex: number, value: string) {
    if (!this.type._profile) this.type._profile = [];

    const profileInfos = <IElement[]> this.type._profile;

    if (profileInfos.length-1 < profileIndex) {
      for (let i = profileInfos.length; i < profileIndex; i++) {
        profileInfos[i] = null;
      }
    }

    let profileInfo = profileInfos[profileIndex];

    if (!profileInfo) {
      profileInfo = {
        extension: []
      };
      profileInfos[profileIndex] = profileInfo;
    }

    profileInfo.extension = profileInfo.extension || [];

    let found = (profileInfo.extension || []).find(e => e.url === Globals.extensionUrls['elementdefinition-profile-element']);

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

      if (foundIndex >= 0) {
        profileInfo.extension.splice(foundIndex, 1);
      }

      if (profileInfo.extension.length === 0) {
        delete profileInfo.extension;
      }

      if (Object.keys(profileInfo).length === 0) {
        if (profileInfos.length - 1 > profileIndex) {
          profileInfos[profileIndex] = null;
        } else {
          profileInfos.splice(profileIndex, 1);
        }
      }
    }
  }

  ngOnInit() {
    this.definedTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/defined-types');
  }
}
