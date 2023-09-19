import {Component, OnInit} from '@angular/core';
import {CodeSystemService} from '../shared/code-system.service';
import { CodeSystem } from '@trifolia-fhir/stu3';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute} from '@angular/router';
import { IFhirResource } from '@trifolia-fhir/models';

@Component({
  templateUrl: './codesystems.component.html',
  styleUrls: ['./codesystems.component.css']
})
export class CodesystemsComponent extends BaseComponent implements OnInit {
  public codeSystems: Array<IFhirResource>;
  public total: number;
  public nameText: string;
  public page = 1;
  public criteriaChangedEvent = new Subject<void>();
  public Globals = Globals;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private codeSystemService: CodeSystemService,
    private modalService: NgbModal,
    public route: ActivatedRoute) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getCodeSystems();
      });
  }

  public isEditDisabled(codeSystem: IFhirResource) {
    if (!this.configService.config || !this.configService.config.nonEditableResources || !this.configService.config.nonEditableResources.codeSystems) {
      return false;
    }

    const isNonEditable = this.configService.config.nonEditableResources.codeSystems.indexOf((<CodeSystem>codeSystem.resource).url) >= 0;

    return isNonEditable || !this.canEdit(codeSystem);
  }

  public nameTextChanged(value: string) {
    this.nameText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public clearFilters() {
    this.nameText = null;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public remove(codeSystem: IFhirResource) {
    if (!confirm(`Are you sure you want to delete the code system "${(<CodeSystem>codeSystem.resource).title || (<CodeSystem>codeSystem.resource).name || codeSystem.id}"`)) {
      return;
    }

    this.codeSystemService.delete(codeSystem.id)
      .subscribe({ 
        next: () => {
          const entry = (this.codeSystems || []).find((e) => e.id === codeSystem.id);
          const index = this.codeSystems.indexOf(entry);
          this.codeSystems.splice(index, 1);
        }, 
        error: (err) => {
          this.configService.handleError(err, 'An error occurred while deleting the code system');
        }
      });
  }

  public changeId(codeSystem: CodeSystem) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.resourceType = codeSystem.resourceType;
    modalRef.componentInstance.originalId = codeSystem.id;
    modalRef.result.then((newId) => {
      codeSystem.id = newId;
    });
  }

  public getImplementationGuideId(){
    return this.route.snapshot.paramMap.get('implementationGuideId');
  }

  public async getCodeSystems() {
    await this.codeSystemService.searchCodeSystem(this.page, this.nameText, this.getImplementationGuideId()).toPromise().then((results) => {
      this.codeSystems = results.results;
      this.total = results.total;
    }).catch((err) => console.log(err));

  }

  ngOnInit() {
    this.getCodeSystems();
  }
}
