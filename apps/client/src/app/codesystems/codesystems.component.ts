import {Component, OnInit} from '@angular/core';
import {CodeSystemService} from '../shared/code-system.service';
import {CodeSystem} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../shared/config.service';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './codesystems.component.html',
  styleUrls: ['./codesystems.component.css']
})
export class CodesystemsComponent extends BaseComponent implements OnInit {
  public codeSystem;
  public total: string;
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

  public get codeSystems(): CodeSystem[] {
    if (!this.codeSystem) {
      return [];
    }

    return (this.codeSystem.results || []).map((entry) => <CodeSystem>entry);
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
        const entry = (this.codeSystem || []).find((e) => e.resource.id === codeSystem.id);
        const index = this.codeSystem.entry.indexOf(entry);
        this.codeSystem.splice(index, 1);
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while deleting the code system');
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
    await this.codeSystemService.search(this.page, this.nameText, this.getImplementationGuideId()).toPromise().then((results) => {
      this.codeSystem = results;
      this.total = this.codeSystem.total;
    }).catch((err) => console.log(err));

  }

  ngOnInit() {
    this.getCodeSystems();
  }
}
