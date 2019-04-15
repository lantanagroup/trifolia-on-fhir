import {Component, OnInit} from '@angular/core';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirReferenceModalComponent} from '../fhir-edit/reference-modal/reference-modal.component';
import {FhirService} from '../shared/fhir.service';
import {StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
  public structureDefinition = new StructureDefinition();
  public baseProfile: StructureDefinition;
  public message: string;

  constructor(
    private fhirService: FhirService,
    private route: Router,
    private modalService: NgbModal,
    private strucDefService: StructureDefinitionService) {
  }

  public get baseProfileName() {
    if (this.baseProfile) {
      return this.baseProfile.title || this.baseProfile.name;
    }
    return '';
  }

  public selectBaseProfile() {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, {size: 'lg'});
    modalRef.componentInstance.resourceType = 'StructureDefinition';
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((result) => {
      this.baseProfile = result.resource;
      this.typeChanged();
    });
  }

  public unSelectBaseProfile() {
    this.baseProfile = null;
    this.typeChanged();
  }

  public saveDisabled() {
    const baseProfileValid = !this.baseProfile || this.baseProfile.type === this.structureDefinition.type;

    return !this.structureDefinition.url ||
      !this.structureDefinition.name ||
      !this.structureDefinition.type ||
      !this.structureDefinition.kind ||
      !this.structureDefinition.hasOwnProperty('abstract') ||
      !baseProfileValid;
  }

  public save() {
    this.strucDefService.save(this.structureDefinition)
      .subscribe((results) => {
        this.route.navigate(['/structure-definition/' + results.id]);
      }, (err) => {
        this.message = this.fhirService.getErrorString(err);
      });
  }

  public typeChanged() {
    if (this.baseProfile) {
      this.structureDefinition.baseDefinition = this.baseProfile.url;
    } else {
      this.structureDefinition.baseDefinition = 'http://hl7.org/fhir/StructureDefinition/' + this.structureDefinition.type;
    }
  }

  ngOnInit() {
    this.typeChanged();
  }
}
