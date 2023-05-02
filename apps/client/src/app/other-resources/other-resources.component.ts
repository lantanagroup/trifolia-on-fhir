import { Component, OnInit, ViewChild } from '@angular/core';
import { FhirService } from '../shared/fhir.service';
import { Bundle, Coding } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../shared/config.service';
import { getErrorString } from '../../../../../libs/tof-lib/src/lib/helper';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import { ConformanceService } from '../shared/conformance.service';
import { Paginated } from '@trifolia-fhir/tof-lib';
import { IConformance } from '@trifolia-fhir/models';

@Component({
  templateUrl: './other-resources.component.html',
  styleUrls: ['./other-resources.component.css']
})
export class OtherResourcesComponent implements OnInit {
  public criteriaChangedEvent = new Subject();
  public resourceTypes: Coding[];
  public searchResourceType: string;
  public searchContent: string;
  public searchUrl: string;
  public message: string;
  public results: Paginated<IConformance>;
  public Globals = Globals;
  public page = 1;
  public ignoreContext = false;
  public total: string;

  @ViewChild('tabSet', { static: true })
  public tabSet: NgbNav;


  constructor(
    public configService: ConfigService,
    private conformanceService: ConformanceService,
    private fhirService: FhirService,
    public route: ActivatedRoute
    ) {

    this.criteriaChangedEvent.pipe(debounceTime(500))
      .subscribe(() => {
        this.search();
      });
  }

  public search() {
    if (!this.searchResourceType) {
      return;
    }

    if (this.tabSet.activeId === "criteria") this.page = 1;

    this.message = 'Searching...';

    // this.fhirService.search(this.searchResourceType, this.searchContent, true, this.searchUrl, null, null, null, true, this.page, 10, this.ignoreContext)
    //   .subscribe((results: Bundle) => {
    //     this.results = results;
    //     this.message = 'Done searching.';
    //     this.tabSet.select('results');
    //   }, (err) => {
    //     this.message = 'Error while searching for other resources: ' + getErrorString(err);
    //   });

    this.conformanceService.search(this.page, 'name', this.configService.fhirVersion,
      this.ignoreContext ? null : this.configService.project.implementationGuideId,
      this.searchResourceType
    ).subscribe({
      next: (res) => {
        this.results = res;
        this.message = 'Done searching.';
        this.tabSet.select('results');
      },
      error: (err) => {
        this.message = 'Error while searching for other resources: ' + getErrorString(err);
      }
    });


  }

  public getEntryUrl(entry) {
    if (entry && entry.fullUrl) {
      return entry.fullUrl;
    }

    return '';
  }

  public getEntryName(entry) {
    if (entry && entry.resource) {
      const resource = entry.resource;

      if (resource.title) {
        return resource.title;
      }

      if (resource.name) {
        if (typeof resource.name === 'string') {
          return resource.name;
        } else if (resource.name instanceof Array && resource.name.length > 0) {
          if (resource.name[0].text) {
            return resource.name[0].text;
          }

          let retName = '';

          if (resource.name[0].given) {
            retName = resource.name[0].given.join(' ');
          }

          if (resource.name[0].family) {
            retName += ' ' + resource.name[0].family;
          }

          return retName;
        }
      }
    }
  }

  public getImplementationGuideId(){
    return this.route.snapshot.paramMap.get('implementationGuideId');
  }

  ngOnInit() {
    this.resourceTypes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
    const resourceIndex = this.resourceTypes.findIndex(resource => {
      return resource.code === "Resource";
    });
    this.resourceTypes.splice(resourceIndex, 1);
  }
}
