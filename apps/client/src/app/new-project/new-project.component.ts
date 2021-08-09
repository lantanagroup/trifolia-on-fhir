import {Component, EventEmitter, OnInit} from '@angular/core';
import {ImplementationGuideService} from "../shared/implementation-guide.service";
import {IImplementationGuide} from "../../../../../libs/tof-lib/src/lib/fhirInterfaces";
import {ImplementationGuide as R4ImplementationGuide} from "../../../../../libs/tof-lib/src/lib/r4/fhir";
import {FhirService} from "../shared/fhir.service";
import {ConfigService} from "../shared/config.service";
import {ImplementationGuide as STU3ImplementationGuide} from "../../../../../libs/tof-lib/src/lib/stu3/fhir";

@Component({
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {
  public igChanging: EventEmitter<boolean> = new EventEmitter<boolean>();
  public step = 1;
  public isHL7 = false;
  public isFHIR = false;
  public jurisdictionCodes;
  public selectedJurisdiction;
  public projectCode: string;
  public packageId: string;
  public canonicalURL: string;
  public igUrl: string
  public igName: string;
  public igTitle: string;
  public igVersion: string;


  constructor(private igService: ImplementationGuideService,
              private fhirService: FhirService,
              private configService: ConfigService) {
  }

  done() {
    let ig: IImplementationGuide;

    // Create the implementation guide based on the FHIR server we're connected to
    if (this.configService.isFhirR4) {
      ig = new R4ImplementationGuide();
    } else if (this.configService.isFhirSTU3) {
      ig = new STU3ImplementationGuide();
    }

    // TODO: Populate the implementation guide based on the fields entered by the user
  }

  nextStep() {
    if (this.step === 3 && this.isHL7) {
      this.done();
    } else if (this.step === 2 && !this.isHL7) {
      this.done();
    } else {
      this.step++;
    }
  }

  get showHL7Step2() {
    return this.isHL7 && this.step === 2;
  }

  get showHL7Step3() {
    return this.isHL7 && this.step === 3;
  }

  get showPrivateStep2() {
    return !this.isHL7 && this.step === 2;
  }

  packageIdCriteriaChanged() {
    this.packageId = `hl7.${this.isFHIR ? 'fhir' : 'cda'}.${this.selectedJurisdiction ? this.selectedJurisdiction.code : 'uv'}.${this.projectCode || 'unknown'}`;
    this.canonicalURL = `https://fhir.org/${this.isFHIR ? 'fhir' : 'cda'}/${this.selectedJurisdiction ? this.selectedJurisdiction.code : 'uv'}/${this.projectCode || 'unknown'}`;
    this.igUrl = `https://fhir.org/${this.isFHIR ? 'fhir' : 'cda'}/${this.selectedJurisdiction ? this.selectedJurisdiction.code : 'uv'}/${this.projectCode || 'unknown'}/ImplementationGuide/${this.projectCode || 'unknown'}`;
  }

  igNameChanged() {
    this.igName = this.igTitle.split(" ").join("");
  }

  getFhirVersion() {
    this.igVersion = this.configService.fhirConformanceVersion;
  }

  ngOnInit() {
    this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/iso3166-1-2');
    this.jurisdictionCodes.splice(0, 0, {
      system: 'http://unstats.un.org/unsd/methods/m49/m49.htm',
      code: 'UV',
      display: 'Universal'
    });

    this.getFhirVersion();
  }
}
