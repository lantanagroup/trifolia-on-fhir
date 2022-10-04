import { Component, OnInit } from '@angular/core';
import { StructureDefinitionService } from '../shared/structure-definition.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FhirService } from '../shared/fhir.service';
import { StructureDefinition as STU3StructureDefinition } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { StructureDefinition as R4StructureDefinition, StructureDefinitionContextComponent } from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import { AuthService } from '../shared/auth.service';
import { ConfigService } from '../shared/config.service';
import { getErrorString } from '../../../../../libs/tof-lib/src/lib/helper';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import { BaseComponent } from '../base.component';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ILogicalTypeDefinition } from '../../../../../libs/tof-lib/src/lib/logical-type-definition';
import { PackageListModel } from '../../../../../libs/tof-lib/src/lib/package-list-model';
import { ImplementationGuideService } from '../shared/implementation-guide.service';
import { IImplementationGuide } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';


@Component({
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent extends BaseComponent implements OnInit {
  public structureDefinition: STU3StructureDefinition | R4StructureDefinition;
  public message: string;
  public Globals = Globals;
  public selectedType: ILogicalTypeDefinition;
  public isIdUnique = true;
  public idChangedEvent = new Subject();

  constructor(
    public configService: ConfigService,
    private fhirService: FhirService,
    private router: ActivatedRoute,
    private route: Router,
    private modalService: NgbModal,
    protected authService: AuthService,
    private implementationGuideService: ImplementationGuideService,
    private strucDefService: StructureDefinitionService) {

    super(configService, authService);

    this.structureDefinition = this.configService.isFhirR4 ?
      new R4StructureDefinition({ meta: this.authService.getDefaultMeta() }) :
      new STU3StructureDefinition({meta: this.authService.getDefaultMeta()});

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        this.isIdUnique = await this.fhirService.checkUniqueId(this.structureDefinition);
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
        ((<StructureDefinitionContextComponent> this.structureDefinition.context[0]).type === ''
        || (<StructureDefinitionContextComponent> this.structureDefinition.context[0]).expression === '' )) ||
      !this.structureDefinition.hasOwnProperty('abstract') ||
      !this.canEdit(this.structureDefinition) ||
      !this.selectedType;
  }

  public save() {
    this.strucDefService.save(this.structureDefinition)
      .subscribe((results) => {
        this.route.navigate([`${this.configService.baseSessionUrl}/structure-definition/${results.id}`]);
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

  async ngOnInit() {
    const implementationGuideId = this.router.snapshot.paramMap.get('implementationGuideId');
    const implementationGuide = <IImplementationGuide>await this.implementationGuideService.getImplementationGuide(implementationGuideId).toPromise();
    const packageList = PackageListModel.getPackageList(implementationGuide);
    if (packageList) {
      this.structureDefinition.url = packageList.canonical;
    }
  }
}
