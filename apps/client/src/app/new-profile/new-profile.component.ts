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
  public message: string;

  constructor(
    private fhirService: FhirService,
    private route: Router,
    private modalService: NgbModal,
    private strucDefService: StructureDefinitionService) {
  }

  public saveDisabled() {
    return !this.structureDefinition.url ||
      !this.structureDefinition.baseDefinition ||
      !this.structureDefinition.name ||
      !this.structureDefinition.type ||
      !this.structureDefinition.kind ||
      !this.structureDefinition.hasOwnProperty('abstract');
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
    this.structureDefinition.baseDefinition = `http://hl7.org/fhir/StructureDefinition/${this.structureDefinition.type}`;
  }

  ngOnInit() {
    this.typeChanged();
  }
}
