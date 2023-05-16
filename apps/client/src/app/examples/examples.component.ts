import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import { IConformance, IExample } from '@trifolia-fhir/models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'trifolia-fhir-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent implements OnInit {
  public examplesFhir: IConformance[] = [];
  public examplesOther: IExample[] = [];
  public searchText: string;

  constructor(public route: ActivatedRoute, private igService: ImplementationGuideService, public configService: ConfigService) { }

  public get filteredFhirExamples() {
    if (!this.searchText) return this.examplesFhir;

    return (this.examplesFhir || [])
      .filter(e => {
        return JSON.stringify(e).toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0;
      });
  }

  public get filteredOtherExamples() {
    if (!this.searchText) return this.examplesOther;

    return (this.examplesOther || [])
      .filter(e => {
        return JSON.stringify(e).toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0;
      });
  }
  

  async ngOnInit() {
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    if (implementationGuideId) {
      let res = await firstValueFrom(this.igService.getExamples(implementationGuideId));
      if (!res) {
        this.examplesFhir = [];
        this.examplesOther = [];
      }
      

      (res || []).forEach((r: IConformance|IExample) => {
        if (r['resource']) {
          this.examplesFhir.push(<IConformance>r);
        } else {
          this.examplesOther.push(<IExample>r);
        }
      });


      this.examplesFhir.sort((a, b) => {
        if (a.resource.resourceType === b.resource.resourceType) {
          const aName = a.resource.id || '';
          const bName = b.resource.id || '';
          return aName.localeCompare(bName);
        }

        const aResourceType = a.resource.resourceType || '';
        const bResourceType = b.resource.resourceType || '';
        return aResourceType.localeCompare(bResourceType);
      });

      this.examplesOther.sort((a, b) => {
        if (a.content.resourceType === b.content.resourceType) {
          const aName = a.content.name || '';
          const bName = b.content.name || '';
          return aName.localeCompare(bName);
        }

        const aResourceType = a.content.resourceType || '';
        const bResourceType = b.content.resourceType || '';
        return aResourceType.localeCompare(bResourceType);
      });

      
    }
  }
}
