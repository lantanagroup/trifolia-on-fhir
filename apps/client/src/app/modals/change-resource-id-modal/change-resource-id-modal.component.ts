import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../shared/fhir.service';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from '../../shared/config.service';
import {Router} from '@angular/router';
import {Subject} from "rxjs";
import {AuthService} from "../../shared/auth.service";
import {StructureDefinition as R4StructureDefinition} from "../../../../../../libs/tof-lib/src/lib/r4/fhir";
import {StructureDefinition as STU3StructureDefinition} from "../../../../../../libs/tof-lib/src/lib/stu3/fhir";
import {debounceTime} from "rxjs/operators";

@Component({
  templateUrl: './change-resource-id-modal.component.html',
  styleUrls: ['./change-resource-id-modal.component.css']
})
export class ChangeResourceIdModalComponent implements OnInit {
  public structureDefinition: STU3StructureDefinition | R4StructureDefinition;
  @Input() resourceType: string;
  @Input() originalId: string;
  public newId: string;
  public message: string;

  public isIdUnique = true;
  public idChangedEvent = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private configService: ConfigService,
    protected authService: AuthService,
    private fhirService: FhirService) {

    this.structureDefinition = this.configService.isFhirR4 ?
      new R4StructureDefinition({ meta: this.authService.getDefaultMeta() }) :
      new STU3StructureDefinition({meta: this.authService.getDefaultMeta()});

    this.idChangedEvent.pipe(debounceTime(500))
      .subscribe(async () => {
        this.structureDefinition.id = this.newId;
        this.isIdUnique = await this.fhirService.checkUniqueId(this.structureDefinition);
      });
  }

  get newIdBinding() {
    return this.newId;
  }

  set newIdBinding(value: string) {
    const changed = this.newId !== value;
    this.newId = value;

    if (changed) {
      this.idChangedEvent.next();
    }
  }

  public ok() {
    const newId = this.newId;
    this.fhirService.changeResourceId(this.resourceType, this.originalId, newId)
      .subscribe(() => {
        if (this.resourceType === 'ImplementationGuide' && this.originalId === this.configService.project.implementationGuideId) {
          // noinspection JSIgnoredPromiseFromCall
          this.configService.project.implementationGuideId = newId;
          this.router.navigate([`${this.configService.fhirVersion}/${newId}/implementation-guide`]);
        }

        this.activeModal.close(this.newId);
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  get idIsValid() {
    if (!this.newId) return false;
    const theRegex = /^[A-Za-z0-9\-]{1,64}$/gm;
    return theRegex.test(this.newId);
  }

  ngOnInit() {
    this.newId = this.originalId;
  }
}
