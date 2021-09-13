import {Component, EventEmitter, OnInit} from '@angular/core';
import {ImplementationGuideService} from "../shared/implementation-guide.service";
import {IImplementationGuide} from "../../../../../libs/tof-lib/src/lib/fhirInterfaces";
import {
  ImplementationGuide,
  ImplementationGuide as R4ImplementationGuide
} from "../../../../../libs/tof-lib/src/lib/r4/fhir";
import {FhirService} from "../shared/fhir.service";
import {ConfigService} from "../shared/config.service";
import {ImplementationGuide as STU3ImplementationGuide} from "../../../../../libs/tof-lib/src/lib/stu3/fhir";
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {Router} from '@angular/router';
import {getErrorString} from "../../../../../libs/tof-lib/src/lib/helper";
import {PackageListModel} from "../../../../../libs/tof-lib/src/lib/package-list-model";
import {identifyRelease} from "../../../../../libs/tof-lib/src/lib/fhirHelper";
import {Extension as STU3Extension} from "../../../../../libs/tof-lib/src/lib/stu3/fhir"

@Component({
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {
  public message: string;
  public igChanging: EventEmitter<boolean> = new EventEmitter<boolean>();
  public step = 1;
  public isHL7 = true;
  public isFHIR = true;
  public jurisdictionCodes;
  public selectedJurisdiction;
  public projectCode: string;
  public packageId: string;
  public canonicalURL: string;
  public igUrl: string
  public igName: string;
  public igTitle: string;
  public igId: string;
  public fhirVersion: string;
  public Globals = Globals;
  public hl7WorkGroup: string;


  constructor(private igService: ImplementationGuideService,
              private fhirService: FhirService,
              private configService: ConfigService,
              private router: Router) {
  }

  done() {
    let ig: IImplementationGuide;
    const packageList = new PackageListModel();
    packageList.title = this.igTitle;
    packageList["package-id"] = this.packageId;
    packageList.canonical = this.canonicalURL;
    packageList.list = [];
    packageList.list.push({
      status: 'ci-build',
      version: 'current',
      path: this.igUrl,
      desc: 'tbd',
      fhirversion: this.fhirVersion
    });

    if (this.configService.isFhirR4) {
      ig = new R4ImplementationGuide();
    } else if (this.configService.isFhirSTU3) {
      ig = new STU3ImplementationGuide();
    } else {
      throw new Error('Unexpected FHIR version');
    }


    this.igId = this.projectCode.replace(/\./g, '-');
    ig.url = this.igUrl;
    ig.version = this.fhirVersion;
    ig.name = this.igName;
    const wg = Globals.hl7WorkGroups.find(w => w.url === this.hl7WorkGroup);
    const wgName = wg ? `HL7 International - ${wg.name}` : 'HL7 International Working Group';
    ig.contact = [{
      name: wgName,
      telecom: [{
        system: 'url',
        value: "http://www.hl7.org/Special/committees/",
      }],
    }];

    // Create the implementation guide based on the FHIR server we're connected to
    if (this.configService.isFhirR4) {
      if (this.isHL7) {
        //no option for Family, Project Code, Canonical URL in R4 IG Class
        // TODO: set id to <project-code-with-dashes-instead-of-dots>
        (<R4ImplementationGuide>ig).jurisdiction = this.selectedJurisdiction;
        (<R4ImplementationGuide>ig).packageId = this.packageId;
        (<R4ImplementationGuide>ig).title = this.igTitle;
      }
    } else if (this.configService.isFhirSTU3) {
      if (this.isHL7) {
        (<STU3ImplementationGuide>ig).jurisdiction = this.selectedJurisdiction;
        const packageIdExt = new STU3Extension();
        packageIdExt.url = Globals.extensionUrls['extension-ig-package-id'];
        packageIdExt.valueString = this.packageId;
        ig.extension = ig.extension || [];
        ig.extension.push(packageIdExt);
      }
    }

    PackageListModel.setPackageList(ig, packageList, identifyRelease(this.configService.fhirConformanceVersion));

    this.igService.saveImplementationGuide(ig)
      .subscribe((implementationGuide: ImplementationGuide) => {
        this.router.navigate([`${this.configService.fhirServer}/${implementationGuide.id}/implementation-guide`]);
      }, (err) => {
        this.message = 'An error occurred while saving the implementation guide: ' + getErrorString(err);
      });


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

  previousStep() {
    if (this.step >= 2) {
      this.step = this.step - 1;
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

  setProjectCode(value: string) {
    this.projectCode = value;
    this.packageIdCriteriaChanged();
  }

  packageIdCriteriaChanged() {
    this.packageId = `hl7.${this.isFHIR ? 'fhir' : 'cda'}.${this.selectedJurisdiction ? this.selectedJurisdiction.code.toLowerCase() : 'us'}.${this.projectCode || 'unknown'}`;
    this.canonicalURL = `https://fhir.org/${this.isFHIR ? 'fhir' : 'cda'}/${this.selectedJurisdiction ? this.selectedJurisdiction.code.toLowerCase() : 'us'}/${this.projectCode || 'unknown'}`;
    this.igUrl = `https://fhir.org/${this.isFHIR ? 'fhir' : 'cda'}/${this.selectedJurisdiction ? this.selectedJurisdiction.code : 'us'}/${this.projectCode || 'unknown'}/ImplementationGuide/${this.projectCode || 'unknown'}`;
  }

  setIgCanonicalUrl(value: string) {
    this.canonicalURL = value;
    this.igUrlChanged();
  }

  setIgId(value: string) {
    this.projectCode = value;
    this.igUrlChanged();
  }

  igUrlChanged() {
    this.igUrl = (this.canonicalURL || '') + (this.canonicalURL && this.canonicalURL.endsWith('/') ? '' : '/') + `ImplementationGuide/${this.projectCode || 'unknown'}`;
  }

  igNameChanged() {
    this.igName = this.igTitle.replace(/[^a-zA-Z0-9]/g, '');
  }

  getFhirVersion() {
    this.fhirVersion = this.configService.fhirConformanceVersion;
  }

  isValidId(id: string) {
    const results = /^[A-Za-z0-9\-\\.]{1,64}$/.exec(id);
    return !!results;
  }

  isValidUrl(url: string) {
    return !!(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/.exec(url));
  }

  ngOnInit() {
    if (this.configService.isFhirR4) {
      this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/iso3166-1-2');
    } else if (this.configService.isFhirSTU3) {
      this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/jurisdiction');
    }
    this.jurisdictionCodes.splice(0, 0, {
      system: 'http://unstats.un.org/unsd/methods/m49/m49.htm',
      code: 'UV',
      display: 'Universal'
    });

    this.selectedJurisdiction = this.jurisdictionCodes.find(jc => jc.code.toLowerCase() === 'us');


    this.getFhirVersion();
  }
}
