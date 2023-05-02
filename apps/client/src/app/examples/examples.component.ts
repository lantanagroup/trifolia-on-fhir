import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import { IExample } from '@trifolia-fhir/models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'trifolia-fhir-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent implements OnInit {
  public examples: IExample[];
  public searchText: string;

  constructor(public route: ActivatedRoute, private igService: ImplementationGuideService, public configService: ConfigService) { }

  public get filteredExamples() {
    if (!this.searchText) return this.examples;

    return (this.examples || [])
      .filter(e => {
        return JSON.stringify(e).toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0;
      });
  }

  async ngOnInit() {
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    if (implementationGuideId) {
      this.examples = await firstValueFrom(this.igService.getExamples(implementationGuideId));
      this.examples.sort((a, b) => {
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
