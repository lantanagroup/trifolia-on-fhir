import {Component, OnInit} from '@angular/core';
import {CodeSystemService} from '../shared/code-system.service';
import {Bundle, CodeSystem} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';

@Component({
  templateUrl: './codesystems.component.html',
  styleUrls: ['./codesystems.component.css']
})
export class CodesystemsComponent extends BaseComponent implements OnInit {
  public codeSystemsBundle: Bundle;
  public nameText: string;
  public page = 1;
  public criteriaChangedEvent = new Subject();
  public Globals = Globals;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private codeSystemService: CodeSystemService,
    private modalService: NgbModal) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getCodeSystems();
      });
  }

  public get codeSystems(): CodeSystem[] {
    if (!this.codeSystemsBundle) {
      return [];
    }

    return (this.codeSystemsBundle.entry || []).map((entry) => <CodeSystem>entry.resource);
  }

  public isEditDisabled(codeSystem: CodeSystem) {
    if (!this.configService.config || !this.configService.config.nonEditableResources || !this.configService.config.nonEditableResources.codeSystems) {
      return false;
    }

    const isNonEditable = this.configService.config.nonEditableResources.codeSystems.indexOf(codeSystem.url) >= 0;

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

  public remove(codeSystem: CodeSystem) {
    if (!confirm(`Are you sure you want to delete the code system ${codeSystem.title || codeSystem.name || codeSystem.id}`)) {
      return;
    }

    this.codeSystemService.delete(codeSystem.id)
      .subscribe(() => {
        const entry = (this.codeSystemsBundle.entry || []).find((entry) => entry.resource.id === codeSystem.id);
        const index = this.codeSystemsBundle.entry.indexOf(entry);
        this.codeSystemsBundle.entry.splice(index, 1);
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while deleting the code system');
      });
  }

  public changeId(codeSystem: CodeSystem) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
    modalRef.componentInstance.resourceType = codeSystem.resourceType;
    modalRef.componentInstance.originalId = codeSystem.id;
    modalRef.result.then((newId) => {
      codeSystem.id = newId;
    });
  }

  public getCodeSystems() {
    const implementationGuideId = this.configService.project ?
      this.configService.project.implementationGuideId :
      null;

    this.codeSystemService.search(this.page, this.nameText, implementationGuideId)
      .subscribe((results) => {
        this.codeSystemsBundle = results;
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while searching for code systems');
      });
  }

  ngOnInit() {
    this.getCodeSystems();
  }
}
