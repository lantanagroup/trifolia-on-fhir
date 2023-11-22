import {Component, EventEmitter, OnInit} from '@angular/core';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {getErrorString, Globals, identifyRelease, IImplementationGuide, PublishingRequestModel} from '@trifolia-fhir/tof-lib';
import {ImplementationGuide as R4ImplementationGuide} from '@trifolia-fhir/r4';
import {ImplementationGuide as R5ImplementationGuide} from '@trifolia-fhir/r5';
import {FhirService} from '../shared/fhir.service';
import {ConfigService} from '../shared/config.service';
import {Extension as STU3Extension, ImplementationGuide as STU3ImplementationGuide} from '@trifolia-fhir/stu3';
import {Router} from '@angular/router';
import {ProjectService} from '../shared/projects.service';
import {IFhirResource, IProject, PublicationRequest} from '@trifolia-fhir/models';
import {firstValueFrom} from 'rxjs';
import {NonFhirResourceService} from '../shared/non-fhir-resource.service';

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
  public igUrl: string;
  public igName: string;
  public igTitle: string;
  public igId: string;
  public fhirVersion: string;
  public Globals = Globals;
  public hl7WorkGroup: string;


  constructor(
    private igService: ImplementationGuideService,
    private projectService: ProjectService,
    private fhirService: FhirService,
    private nonFhirResourceService: NonFhirResourceService,
    private configService: ConfigService,
    private router: Router) {
  }

  async done() {

    let ig: IImplementationGuide;

    const publishingRequest = new PublishingRequestModel();
    publishingRequest['package-id'] = this.packageId;
    publishingRequest.version = '0.1.0';
    publishingRequest.path = this.canonicalURL;
    publishingRequest.milestone = false;
    publishingRequest.status = 'ci-build';
    publishingRequest.sequence = 'Releases';
    publishingRequest.desc = 'New IG: ' + this.igTitle;
    publishingRequest.title = this.igTitle;
    publishingRequest.category = 'National Base';
    publishingRequest['ci-build'] = 'http://build.fhir.org/ig/';
    publishingRequest.introduction = 'New IG: ' + this.igTitle;

    let publicationRequest = new PublicationRequest();
    publicationRequest.content = publishingRequest;

    if (this.fhirVersion == 'r4') {
      ig = new R4ImplementationGuide();
      this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/iso3166-1-2');
    } else if (this.fhirVersion === 'r5') {
      ig = new R5ImplementationGuide();
      this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/iso3166-1-2');
    } else if (this.fhirVersion == 'stu3') {
      ig = new STU3ImplementationGuide();
      this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/jurisdiction');
    } else {
      throw new Error(`Unexpected FHIR version: ${this.configService.fhirVersion}`);
    }

  //  this.igId = this.projectCode.replace(/\./g, '-');
    ig.version = '0.1.0';
    ig.name = this.igName.replace(/[^a-zA-Z0-9_]/g, '');
    ig.name  = ig.name.charAt(0).toUpperCase() + ig.name.slice(1);
    ig.id =  ig.name.replace(/_/gi, '-');
    ig.url = `${this.igUrl}/${ig.id}`;
    const wg = Globals.hl7WorkGroups.find(w => w.url === this.hl7WorkGroup);
    const wgName = wg ? `HL7 International - ${wg.name}` : 'HL7 International Working Group';
    ig.contact = [{
      name: wgName,
      telecom: [{
        system: 'url',
        value: wg ? wg.url : "",
      }],
    }];

    const jurisdiction = this.selectedJurisdiction ? [{ coding: [this.selectedJurisdiction] }] : this.selectedJurisdiction;
    // Create the implementation guide based on the FHIR server we're connected to
    if (this.fhirVersion === 'r5') {
      if (this.isHL7) {
        //no option for Family, Project Code, Canonical URL in R4 IG Class
        // TODO: set id to <project-code-with-dashes-instead-of-dots>
        (<R5ImplementationGuide>ig).jurisdiction = jurisdiction;
        (<R5ImplementationGuide>ig).packageId = this.packageId;
        (<R5ImplementationGuide>ig).title = this.igTitle;
      }
    } else if (this.fhirVersion === 'r4') {
        //no option for Family, Project Code, Canonical URL in R4 IG Class
        // TODO: set id to <project-code-with-dashes-instead-of-dots>
        (<R4ImplementationGuide>ig).jurisdiction = jurisdiction;
        (<R4ImplementationGuide>ig).packageId = this.packageId;
        (<R4ImplementationGuide>ig).title = this.igTitle;

    } else if (this.fhirVersion == 'stu3') {
      if (this.isHL7) {

       // (<STU3ImplementationGuide>ig).jurisdiction = jusrisdiction;
        const packageIdExt = new STU3Extension();
        packageIdExt.url = Globals.extensionUrls['extension-ig-package-id'];
        packageIdExt.valueString = this.packageId;
        ig.extension = ig.extension || [];
        ig.extension.push(packageIdExt);
      }
    } else {
      throw new Error(`Unexpected FHIR version: ${this.configService.fhirVersion}`);
    }
    let projectName = ig.name;


    let newRes: IFhirResource = <IFhirResource>{fhirVersion: this.fhirVersion, resource: ig, versionId: 1, lastUpdated: new Date(), references: [] };

    this.igService.saveImplementationGuide(null, newRes)
      .subscribe({
        next: async (ig: IFhirResource) => {

          publicationRequest = await firstValueFrom(this.nonFhirResourceService.save(publicationRequest.id, publicationRequest, ig.id));

          let project: IProject = <IProject>{ fhirVersion: this.fhirVersion, name: projectName };
          project.references = project.references || [];
          project.references.push({'value' : ig, valueType: 'FhirResource'});
          await this.projectService.save(project).toPromise().then((project) => {
            this.router.navigate([`/projects/${ig.id}/implementation-guide`]);
          }).catch((err) => this.message = getErrorString(err));
        },
        error: (err) => {
          this.message = 'An error occurred while saving the implementation guide: ' + getErrorString(err);
        }
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
    this.hl7packageIdCriteriaChanged();
  }


  hl7packageIdCriteriaChanged() {
    const projectCode = this.projectCode.replace(/[^a-zA-Z0-9_-]/gi, '');
    this.packageId = `hl7.${this.isFHIR ? 'fhir' : 'cda'}.${this.selectedJurisdiction ? this.selectedJurisdiction.code.toLowerCase() : 'us'}.${projectCode || 'unknown'}`;
    this.canonicalURL = `https://fhir.org/${this.isFHIR ? 'fhir' : 'cda'}/${this.selectedJurisdiction ? this.selectedJurisdiction.code.toLowerCase() : 'us'}/${projectCode || 'unknown'}`;
    this.igUrl = `https://fhir.org/${this.isFHIR ? 'fhir' : 'cda'}/${this.selectedJurisdiction ? this.selectedJurisdiction.code.toLowerCase() : 'us'}/${projectCode || 'unknown'}/ImplementationGuide`;
  }

  nonHl7packageIdChanged() {
    const projectCode = this.projectCode.replace(/[^a-zA-Z0-9_-]/gi, '');
    this.packageId = '.' + projectCode;
  }

  setIgCanonicalUrl(value: string) {
    this.canonicalURL = value;
    this.igUrlChanged();
  }

  setIgId(value: string) {
    this.projectCode = value.split('.').join('-');
    this.igUrlChanged();
    this.nonHl7packageIdChanged();
  }

  igUrlChanged() {
    this.igUrl = (this.canonicalURL || '') + (this.canonicalURL && this.canonicalURL.endsWith('/') ? '' : '/') + `ImplementationGuide/${this.projectCode || 'unknown'}`;
  }

  igNameChanged() {
    this.igName = this.igTitle.replace(/[^a-zA-Z0-9_]/g, '');
  }

  igIdChanged() {
    this.igId = this.igName.replace(/[^a-zA-Z0-9]/g, '');
  }

  isValidName(name: string) {
    const results = /^[A-Z][A-Za-z0-9_]+$/.exec(name);
    return !!results;
  }


  isValidId(id: string) {
    const results = /^[^.][A-Za-z0-9\-\\.]{1,64}$/.exec(id);
    return !!results;
  }

  isValidPrivatePackageId(id: string) {
    const results = /^(?!\.)[A-z0-9\.]+$/.exec(id);

    return !!results;
  }

  isValidUrl(url: string) {
    return !!(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/.exec(url));
  }

  /*addCoding(jurisdiction: ICodeableConcept, index: number) {
    jurisdiction.coding = jurisdiction.coding || [];
    jurisdiction.coding.push({});
    if (jurisdiction.coding.length === 1) {
      this.setJurisdictionCode(this.jurisdictions[index], 0, this.jurisdictionCodes[0]);
    }
  }
  */
  ngOnInit() {
    if (this.configService.isFhirR4 || this.configService.isFhirR5) {
      this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/iso3166-1-2');
    } else if (this.configService.isFhirSTU3) {
      this.jurisdictionCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/jurisdiction');
    }
    this.jurisdictionCodes.splice(0, 0, {
      system: 'http://unstats.un.org/unsd/methods/m49/m49.htm',
      code: 'UV',
      display: 'Universal'
    });

    //let jurisdictionCode: ICoding;
    this.selectedJurisdiction = this.jurisdictionCodes.find(jc => jc.code.toLowerCase() === 'us');

    /*    const u = <ICoding>{
          system: 'http://unstats.un.org/unsd/methods/m49/m49.htm',
          code: '001',
          version: '2.2.0',
          display: 'Universal'
        };*/
    /* if(jurisdictionCode) {
       const universal = <ICodeableConcept>{
         coding: jurisdictionCode
       };
       this.selectedJurisdiction = this.selectedJurisdiction || [];
       this.selectedJurisdiction.push(universal);
     }


 /!*    if(jurisdictionCode) {
       this.selectedJurisdiction.coding = this.selectedJurisdiction.coding || [];
       this.selectedJurisdiction.coding.push({ jurisdictionCode })
     }*!/*/
    //this.getFhirVersion();
  }
}
