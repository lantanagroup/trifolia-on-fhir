import {Component, OnInit} from '@angular/core';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import {Bundle, ImplementationGuide} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {
  SearchImplementationGuideResponse,
  SearchImplementationGuideResponseContainer
} from '../../../../../libs/tof-lib/src/lib/searchIGResponse-model';

@Component({
  selector: 'app-implementation-guides',
  templateUrl: './implementation-guides.component.html',
  styleUrls: ['./implementation-guides.component.css']
})
export class ImplementationGuidesComponent extends BaseComponent implements OnInit {
  public results: SearchImplementationGuideResponse[] = null;
  public total = 0;
  public page = 1;
  public nameText: string;
  public titleText: string;
  public criteriaChangedEvent = new Subject();
  public Globals = Globals;

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private igService: ImplementationGuideService,
    private modalService: NgbModal) {

    super(configService, authService);

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.getImplementationGuides();
      });
  }

  public clearFilters() {
    this.nameText = null;
    this.titleText = null;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public getImplementationGuides() {
    this.results = null;
    this.configService.setStatusMessage('Loading implementation guides');

    this.igService.getImplementationGuides(this.page, this.nameText, this.titleText)
      .subscribe((res: SearchImplementationGuideResponseContainer) => {
        this.results = res.responses;
        this.total = res.total;
        this.configService.setStatusMessage('');
      }, err => {
        this.configService.handleError(err, 'Error loading implementation guides.');
      });
  }

  public remove(implementationGuide: ImplementationGuide) {
    if (!confirm(`Are you sure you want to delete implementation guide "${implementationGuide.name || 'not named'}" with id ${implementationGuide.id}?`)) {
      return;
    }

    this.igService.removeImplementationGuide(implementationGuide.id)
      .subscribe(() => {
        const foundEntry = (this.results || []).find((entry) => entry.data.resource === implementationGuide);
        const index = this.results.indexOf(foundEntry);
        this.results.splice(index, 1);
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while deleting the implementation guide');
      });
  }

  public changeId(implementationGuide: ImplementationGuide) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.resourceType = 'ImplementationGuide';
    modalRef.componentInstance.originalId = implementationGuide.id;
    modalRef.result.then((newId) => {
      implementationGuide.id = newId;
    });
  }

  public get implementationGuides() {
    if (!this.results) {
      return [];
    }
    return this.results;
    //return (this.results || []).map((entry) => <ImplementationGuide>entry.data.resource);
  }

  public nameTextChanged(value: string) {
    this.nameText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public titleTextChanged(value: string) {
    this.titleText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  ngOnInit() {
    this.getImplementationGuides();
    this.configService.fhirServerChanged.subscribe((fhirServer) => this.getImplementationGuides());
  }
}
