import { Component, OnInit } from '@angular/core';
import { StructureDefinitionService } from '../shared/structure-definition.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FhirService } from '../shared/fhir.service';
import { StructureDefinition as R5StructureDefinition } from '../../../../../libs/tof-lib/src/lib/r5/fhir';
import { ImplementationGuide, StructureDefinition as STU3StructureDefinition } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  StructureDefinition as R4StructureDefinition,
  StructureDefinitionContextComponent
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import { AuthService } from '../shared/auth.service';
import { ConfigService } from '../shared/config.service';
import { getErrorString } from '../../../../../libs/tof-lib/src/lib/helper';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import { BaseComponent } from '../base.component';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ILogicalTypeDefinition } from '../../../../../libs/tof-lib/src/lib/logical-type-definition';
import { PublishingRequestModel } from '../../../../../libs/tof-lib/src/lib/publishing-request-model';
import { ImplementationGuideService } from '../shared/implementation-guide.service';
import { IDomainResource } from '@trifolia-fhir/tof-lib';
import { IConformance } from '@trifolia-fhir/models';

@Component({
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent extends BaseComponent implements OnInit {
  public conformance;
  public structureDefinition: STU3StructureDefinition | R4StructureDefinition | R5StructureDefinition;
  public structureDefinitionId: string;
  public message: string;
  public Globals = Globals;
  public selectedType: ILogicalTypeDefinition;

  public isIdUnique = true;
  public idChangedEvent = new Subject<void>();

  public publishingRequest: PublishingRequestModel;
  public publishingRequestJSON;
  public alreadyInUseIDMessage = '';
  public implementationGuide;

  constructor(
    public route: ActivatedRoute,
    public configService: ConfigService,
    private fhirService: FhirService,
    private router: Router,
    private modalService: NgbModal,
    protected authService: AuthService,
    private implementationGuideService: ImplementationGuideService,
    private strucDefService: StructureDefinitionService) {


    super(configService, authService);

    if (this.configService.isFhirR5) {
      this.structureDefinition = new R5StructureDefinition({ meta: this.authService.getDefaultMeta() });
    } else if (this.configService.isFhirR4) {
      this.structureDefinition = new R4StructureDefinition({ meta: this.authService.getDefaultMeta() });
    } else if (this.configService.isFhirSTU3) {
      this.structureDefinition = new STU3StructureDefinition({ meta: this.authService.getDefaultMeta() });
    }

    this.conformance = { resource: this.structureDefinition, fhirVersion: <'stu3' | 'r4' | 'r5'>this.configService.fhirVersion, permissions: this.authService.getDefaultPermissions() };

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        this.isIdUnique = await this.fhirService.checkUniqueId(this.structureDefinition);
        if (!this.isIdUnique) {
          this.alreadyInUseIDMessage = "ID " + this.structureDefinition.id + " is already used in this IG.";
        }
        else {
          this.alreadyInUseIDMessage = "";
        }
      });
  }

  public supportedLocalTypeFormatter = (result: ILogicalTypeDefinition) => {
    return result.code;
  };

  public searchSupportedLogicalTypes = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.strucDefService.getSupportedLogicalTypes(term))
    );
  };

  public saveDisabled() {
    return !this.isIdUnique ||
      !this.structureDefinition.url ||
      !this.structureDefinition.baseDefinition ||
      !this.structureDefinition.name ||
      !this.structureDefinition.type ||
      !this.structureDefinition.kind ||
      (this.configService.isFhirR4 && this.structureDefinition.type === "Extension" && this.structureDefinition.context &&
        ((<StructureDefinitionContextComponent>this.structureDefinition.context[0]).type === ''
          || (<StructureDefinitionContextComponent>this.structureDefinition.context[0]).expression === '')) ||
      !this.structureDefinition.hasOwnProperty('abstract') ||
      !this.canEdit(this.conformance) ||
      !this.selectedType;
  }

  public save() {
    if (this.implementationGuide.fhirVersion.length > 0) {
      this.conformance.resource.fhirVersion = this.implementationGuide.fhirVersion[0];
    }
    this.strucDefService.save(this.structureDefinitionId, this.conformance)
      .subscribe((results) => {

        this.router.navigate([`${this.configService.baseSessionUrl}/structure-definition/${results.id}`]);
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  public typeChanged(selectedType: ILogicalTypeDefinition) {
    if (!selectedType) {
      delete this.structureDefinition.type;
      delete this.structureDefinition.baseDefinition;
      return;
    }

    this.structureDefinition.type = selectedType.code;
    this.structureDefinition.baseDefinition = selectedType.uri;
  }

  public urlChanged() {
    const lastIndex = this.structureDefinition.url.lastIndexOf('/');

    if (lastIndex) {
      this.structureDefinition.id = this.structureDefinition.url.substring(lastIndex + 1);
      this.idChangedEvent.next();
    }
  }

  loadSD(newVal: IDomainResource) {
    if (this.configService.isFhirR5) {
      this.structureDefinition = new R5StructureDefinition(newVal);
    } else if (this.configService.isFhirR4) {
      this.structureDefinition = new R4StructureDefinition(newVal);
    } else if (this.configService.isFhirSTU3) {
      this.structureDefinition = new STU3StructureDefinition(newVal);
    }
    
    if (this.conformance) {
      this.conformance.resource = this.structureDefinition;
    }
  }

  async ngOnInit() {

    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    this.implementationGuide = <ImplementationGuide>(await firstValueFrom(this.implementationGuideService.getImplementationGuide(implementationGuideId))).resource;

    const url = this.implementationGuide.url;
    this.structureDefinition.url = url ? url.substr(0, url.indexOf("ImplementationGuide")) + "StructureDefinition/" : "";

  }

}
