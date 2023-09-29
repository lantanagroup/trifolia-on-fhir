import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import { IFhirResource, INonFhirResource } from '@trifolia-fhir/models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'trifolia-fhir-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent implements OnInit {
  public examplesFhir: IFhirResource[] = [];
  public examplesOther: INonFhirResource[] = [];
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

    if (entry && entry.name) {
      return entry.name;
    }

    return '';

  }


  async ngOnInit() {
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    if (implementationGuideId) {
      let res = await firstValueFrom(this.igService.getExamples(implementationGuideId));
      if (!res) {
        this.examplesFhir = [];
        this.examplesOther = [];
      }


      (res || []).forEach((r: IFhirResource|INonFhirResource) => {
        if (r['resource']) {
          this.examplesFhir.push(<IFhirResource>r);
        } else {
          this.examplesOther.push(<INonFhirResource>r);
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
        if (a.content?.resourceType === b.content?.resourceType) {
          const aName = a.content?.name || '';
          const bName = b.content?.name || '';
          return aName.localeCompare(bName);
        }

        const aResourceType = a.content?.resourceType || '';
        const bResourceType = b.content?.resourceType || '';
        return aResourceType.localeCompare(bResourceType);
      });


    }
  }
}
