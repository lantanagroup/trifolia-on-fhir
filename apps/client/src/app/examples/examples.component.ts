import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {IgExampleModel} from '../../../../../libs/tof-lib/src/lib/ig-example-model';
import {ConfigService} from '../shared/config.service';

@Component({
  selector: 'trifolia-fhir-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent implements OnInit {
  public examples: IgExampleModel[];
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
      this.examples = await this.igService.getExamples(implementationGuideId).toPromise();
      this.examples.sort((a, b) => {
        if (a.resourceType === b.resourceType) {
          const aName = a.name || '';
          const bName = b.name || '';
          return aName.localeCompare(bName);
        }

        const aResourceType = a.resourceType || '';
        const bResourceType = b.resourceType || '';
        return aResourceType.localeCompare(bResourceType);
      });
    }
  }
}
