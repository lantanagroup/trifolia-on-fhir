import {Component, OnInit} from '@angular/core';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../shared/fhir.service';
import {StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {AuthService} from '../shared/auth.service';
import {ConfigService} from '../shared/config.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';

@Component({
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
  public structureDefinition: StructureDefinition;
  public message: string;

  constructor(
    public configService: ConfigService,
    private fhirService: FhirService,
    private route: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private strucDefService: StructureDefinitionService) {

    this.structureDefinition = new StructureDefinition({ meta: this.authService.getDefaultMeta() });
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
        this.route.navigate([`${this.configService.fhirServer}/structure-definition/${results.id}`]);
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  public typeChanged() {
    this.structureDefinition.baseDefinition = `http://hl7.org/fhir/StructureDefinition/${this.structureDefinition.type}`;
  }

  public urlChanged() {
    const lastIndex = this.structureDefinition.url.lastIndexOf('/');

    if (lastIndex) {
      this.structureDefinition.id = this.structureDefinition.url.substring(lastIndex + 1);
    }
  }

  ngOnInit() {
    this.typeChanged();
  }
}
