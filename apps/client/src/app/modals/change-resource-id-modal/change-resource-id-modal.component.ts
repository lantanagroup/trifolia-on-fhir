import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../shared/fhir.service';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from '../../shared/config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from "rxjs";
import {AuthService} from "../../shared/auth.service";
import {StructureDefinition as R5StructureDefinition} from "../../../../../../libs/tof-lib/src/lib/r5/fhir";
import {StructureDefinition as R4StructureDefinition} from "../../../../../../libs/tof-lib/src/lib/r4/fhir";
import {StructureDefinition as STU3StructureDefinition} from "../../../../../../libs/tof-lib/src/lib/stu3/fhir";
import {debounceTime} from "rxjs/operators";
import {Globals} from '@trifolia-fhir/tof-lib';

@Component({
  templateUrl: './change-resource-id-modal.component.html',
  styleUrls: ['./change-resource-id-modal.component.css']
})
export class ChangeResourceIdModalComponent implements OnInit {
  public structureDefinition: STU3StructureDefinition | R4StructureDefinition | R5StructureDefinition;
  @Input() resourceType: string;
  @Input() originalId: string;
  public newId: string;
  public message: string;
  public implementationGuideId: string;
  public isIdUnique = true;
  public idChangedEvent = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private configService: ConfigService,
    protected authService: AuthService,
    private fhirService: FhirService) {

    if (this.configService.isFhirR5) {
      this.structureDefinition = new R5StructureDefinition({ meta: this.authService.getDefaultMeta() });
    } else if (this.configService.isFhirR4) {
      this.structureDefinition = new R4StructureDefinition({ meta: this.authService.getDefaultMeta() });
    } else if (this.configService.isFhirSTU3) {
      this.structureDefinition = new STU3StructureDefinition({meta: this.authService.getDefaultMeta()});
    }

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
          // noinspection JSIgnoredPromiseFromCall
          const url = this.router.url;
          this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/${url}`]).then(()=>{
              console.log(`After navigation I am on:${this.router.url}`)
            })
           })

        this.activeModal.close(this.newId);
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  get idIsValid() {
    if (!this.newId) return false;
    const theRegex = new RegExp(Globals.regexPatterns.fhirIdValidRegex, 'gm');
    return theRegex.test(this.newId);
  }

  ngOnInit() {
    this.newId = this.originalId;

  }
}
