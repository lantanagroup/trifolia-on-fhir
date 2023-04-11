import {Component, OnInit} from '@angular/core';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import {ImplementationGuide} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../modals/change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {debounceTime} from 'rxjs/operators';
import {BaseComponent} from '../base.component';
import {AuthService} from '../shared/auth.service';
import {SearchImplementationGuideResponse, SearchImplementationGuideResponseContainer} from '../../../../../libs/tof-lib/src/lib/searchIGResponse-model';
import {CookieService} from 'ngx-cookie-service';
import type {IImplementationGuide} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';

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
  public idText: string;
  public criteriaChangedEvent = new Subject<void>();
  public Globals = Globals;
  public recentIgs: RecentImplementationGuide[] = [];

  constructor(
    public configService: ConfigService,
    protected authService: AuthService,
    private igService: ImplementationGuideService,
    public cookieService: CookieService,
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
    this.idText = null;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  public getImplementationGuides() {
    this.results = null;
    this.configService.setStatusMessage('Loading implementation guides');

    this.igService.getImplementationGuides(this.page, this.nameText, this.titleText, this.idText)
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
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.resourceType = 'ImplementationGuide';
    modalRef.componentInstance.originalId = implementationGuide.id;
    modalRef.result.then((newId) => {
      implementationGuide.id = newId;
    });
  }

  public get selectCookie() {
    return "igsSelected";
   /* if (this.configService.fhirServer) {
      if (this.configService.fhirServer === 'lantana_hapi_r4_prod') {
        return 'r4ProdRecentIgs';
      } else if (this.configService.fhirServer === 'lantana_hapi_r4') {
        return 'r4DevRecentIgs';
      } else if (this.configService.fhirServer === 'lantana_hapi_stu3_prod') {
        return 'stu3ProdRecentIgs';
      } else if (this.configService.fhirServer === 'lantana_hapi_stu3') {
        return 'stu3DevRecentIgs';
      } else {
        return this.configService.fhirServer;
      }
    }*/
  }

  public projectReselected(recentIg: RecentImplementationGuide) {
    const currentIndex = this.recentIgs.indexOf(recentIg);
    this.recentIgs.splice(currentIndex, 1);
    this.recentIgs.splice(0, 0, recentIg);
    this.cookieService.set(this.selectCookie, JSON.stringify(this.recentIgs));
  }

  public projectSelected(ig: IImplementationGuide) {
    const foundRecent = this.recentIgs.find(ri => ri.id === ig.id);

    if (!foundRecent) {
      this.recentIgs.splice(0, 0, {
        id: ig.id,
        name: ig.name,
        title: (ig as any).title
      });
    } else if (this.recentIgs.indexOf(foundRecent) !== 0) {
      const currentIndex = this.recentIgs.indexOf(foundRecent);
      this.recentIgs.splice(currentIndex, 1);
      this.recentIgs.splice(0, 0, foundRecent);
    }

    if (this.recentIgs.length > 3) {
      this.recentIgs = this.recentIgs.slice(0, 3);
    }

    this.cookieService.set(this.selectCookie, JSON.stringify(this.recentIgs));
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

  public idTextChanged(value: string) {
    this.idText = value;
    this.page = 1;
    this.criteriaChangedEvent.next();
  }

  ngOnInit() {
    this.getImplementationGuides();
 //   this.configService.fhirServerChanged.subscribe(() => this.getImplementationGuides());

    if (!!this.cookieService.get(this.selectCookie)) {
      this.recentIgs = JSON.parse(this.cookieService.get(this.selectCookie));
    }
  }
}

export class RecentImplementationGuide {
  public name: string;
  public title: string;
  public id: string;
}
