import { Component, Input, OnInit } from '@angular/core';
import { StructureDefinitionService } from '../../shared/structure-definition.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/config.service';
import { FhirService } from '../../shared/fhir.service';
import { StructureDefinition as R5StructureDefinition } from '../../../../../../libs/tof-lib/src/lib/r5/fhir';
import { StructureDefinition as R4StructureDefinition } from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import { StructureDefinition as STU3StructureDefinition } from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { getErrorString } from '../../../../../../libs/tof-lib/src/lib/helper';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';
import { IConformance } from '@trifolia-fhir/models';

@Component({
  selector: 'trifolia-fhir-copy-profile-modal',
  templateUrl: './copy-profile-modal.component.html',
  styleUrls: ['./copy-profile-modal.component.css']
})
export class CopyProfileModalComponent implements OnInit {
  public message: string;
  public id: string;
  public title: string;
  public name: string;
  public url: string;
  public autoUrl = true;
  public structureDefinition: STU3StructureDefinition | R4StructureDefinition | R5StructureDefinition;
  public conformance: IConformance;
  public Globals = Globals;

  @Input() originalID: string;

  constructor(public activeModal: NgbActiveModal,
    public router: Router,
    public structureDefinitionService: StructureDefinitionService,
    public configService: ConfigService,
    public fhirService: FhirService) { }

  get idIsValid() {
    if (!this.id) return false;
    const theRegex = new RegExp(Globals.regexPatterns.fhirIdValidRegex, 'gm');
    return theRegex.test(this.id);
  }

  get nameIsValid() {
    if (!this.name) return false;
    const nameRegex = new RegExp(Globals.regexPatterns.namePattern);
    return nameRegex.test(this.name);
  }

  get isValid() {
    return this.idIsValid && this.nameIsValid && this.title && this.url;
  }

  async ngOnInit() {
    this.conformance = await this.structureDefinitionService.getStructureDefinition(this.originalID).toPromise();
    if (this.configService.isFhirSTU3) {
      this.structureDefinition = new STU3StructureDefinition(this.conformance.resource);
    } else if (this.configService.isFhirR4) {
      this.structureDefinition = new R4StructureDefinition(this.conformance.resource);
    } else if (this.configService.isFhirR5) {
      this.structureDefinition = new R5StructureDefinition(this.conformance.resource);
    } else {
      throw new Error(`Unexpected FHIR version: ${this.configService.fhirVersion}`);
    }
    this.url = this.structureDefinition.url.substring(0, this.structureDefinition.url.lastIndexOf("/") + 1);
  }

  public updateUrl() {
    this.url = this.autoUrl ? this.structureDefinition.url.substring(0, this.structureDefinition.url.lastIndexOf("/") + 1) + this.id : this.url;
  }

  public autoUrlChange() {
    this.autoUrl = !this.autoUrl;
  }

  public ok() {
    this.structureDefinition.id = this.id;
    this.structureDefinition.title = this.title;
    this.structureDefinition.url = this.url;
    this.structureDefinition.name = this.name;
    this.message = "Loading new copy...";
    this.conformance.resource = this.structureDefinition;
    this.structureDefinitionService.save(this.structureDefinition.id, this.conformance)
      .subscribe({
        next: (results) => {
          this.router.navigate([`${this.configService.baseSessionUrl}/structure-definition/${results.id}`], {
            queryParams: {
              copy: 'true'
            }
          });
          this.activeModal.close();
        },
        error: (err) => {
          this.activeModal.close(getErrorString(err));
        }
      });
  }

}
