import { Component, Input, OnInit } from '@angular/core';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../shared/fhir.service';
import {StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  StructureDefinition as R4StructureDefinition,
  StructureDefinitionContextComponent
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {AuthService} from '../shared/auth.service';
import {ConfigService} from '../shared/config.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import { BaseComponent } from '../base.component';

@Component({
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent extends BaseComponent implements OnInit {
  public structureDefinition: STU3StructureDefinition | R4StructureDefinition;
  public message: string;
  public Globals: Globals;

  constructor(
    public configService: ConfigService,
    private fhirService: FhirService,
    private route: Router,
    private modalService: NgbModal,
    protected authService: AuthService,
    private strucDefService: StructureDefinitionService) {

    super(configService, authService);

    this.structureDefinition = this.configService.isFhirR4 ?
      new R4StructureDefinition({ meta: this.authService.getDefaultMeta() }) :
      new STU3StructureDefinition({meta: this.authService.getDefaultMeta()});
  }

  public saveDisabled() {
    return !this.structureDefinition.url ||
      !this.structureDefinition.baseDefinition ||
      !this.structureDefinition.name ||
      !this.structureDefinition.type ||
      !this.structureDefinition.kind ||
      (this.configService.isFhirR4 && this.structureDefinition.type === "Extension" && !this.structureDefinition.context) ||
      (this.configService.isFhirR4 && this.structureDefinition.type === "Extension" && this.structureDefinition.context &&
        ((<StructureDefinitionContextComponent> this.structureDefinition.context[0]).type === ''
        || (<StructureDefinitionContextComponent> this.structureDefinition.context[0]).expression === '' )) ||
      !this.structureDefinition.hasOwnProperty('abstract') ||
      !this.canEdit(this.structureDefinition);
  }

  public save() {
    this.strucDefService.save(this.structureDefinition)
      .subscribe((results) => {
        this.route.navigate([`${this.configService.baseSessionUrl}/structure-definition/${results.id}`]);
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
