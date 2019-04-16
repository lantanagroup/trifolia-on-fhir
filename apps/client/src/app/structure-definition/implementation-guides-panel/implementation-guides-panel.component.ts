import {Component, Input, OnInit} from '@angular/core';
import {
  StructureDefinitionImplementationnGuide,
  StructureDefinitionOptions
} from '../../shared/structure-definition.service';
import {ImplementationGuideService} from '../../shared/implementation-guide.service';
import {ConfigService} from '../../shared/config.service';
import {Bundle, ImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';

@Component({
  selector: 'app-implementation-guides-panel',
  templateUrl: './implementation-guides-panel.component.html',
  styleUrls: ['./implementation-guides-panel.component.css']
})
export class ImplementationGuidesPanelComponent implements OnInit {
  @Input() options = new StructureDefinitionOptions();
  @Input() showIntro = true;
  public implementationGuidesBundle: Bundle;
  public newImplementationGuide: StructureDefinitionImplementationnGuide;
  public Globals = Globals;

  constructor(
    private implementationGuideService: ImplementationGuideService,
    private configService: ConfigService) {
  }

  public get implementationGuides() {
    if (!this.implementationGuidesBundle || !this.implementationGuidesBundle.entry) {
      return [];
    }

    return this.implementationGuidesBundle.entry.map((entry) => <ImplementationGuide>entry.resource);
  }

  public addImplementationGuide() {
    this.newImplementationGuide = new StructureDefinitionImplementationnGuide();
    this.newImplementationGuide.isNew = true;
  }

  public doneAdding() {
    this.options.implementationGuides.push(this.newImplementationGuide);
    this.newImplementationGuide = null;
  }

  public removeImplementationGuide(ig: StructureDefinitionImplementationnGuide) {
    if (ig.isNew) {
      const index = this.options.implementationGuides.indexOf(ig);
      this.options.implementationGuides.splice(index, 1);
    } else {
      ig.isRemoved = true;
    }
  }

  public getUnusedImplementationGuides() {
    return this.implementationGuides.filter((implementationGuide) => {
      return !(this.options.implementationGuides || []).find((next) => next.id === implementationGuide.id);
    });
  }

  public setNewImplementationGuide(id: string) {
    const foundImplementationGuide = this.implementationGuides.find((implementationGuide) => implementationGuide.id === id);

    if (foundImplementationGuide) {
      this.newImplementationGuide.id = foundImplementationGuide.id;
      this.newImplementationGuide.name = foundImplementationGuide.name;
    }
  }

  ngOnInit() {
    this.implementationGuideService.getImplementationGuides()
      .subscribe((results) => {
        this.implementationGuidesBundle = results;
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while retrieving implementation guides');
      });
  }
}
