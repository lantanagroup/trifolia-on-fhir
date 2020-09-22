import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IImplementationGuide, IResourceReference, IStructureDefinition} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import {identifyRelease} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Versions} from 'fhir/fhir';
import {Bundle, ImplementationGuide as R4ImplementationGuide, StructureDefinition as R4StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide, StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {parseReference} from '../../../../../libs/tof-lib/src/lib/helper';
import {FhirService} from '../shared/fhir.service';

@Component({
  selector: 'trifolia-fhir-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.css']
})
export class BulkEditComponent implements OnInit {
  public implementationGuide: IImplementationGuide;
  public profiles: (STU3StructureDefinition | R4StructureDefinition)[];
  public expandedProfiles: { [profileId: string]: boolean } = {};
  public editFields: { [key: string]: boolean } = {};
  public message: string;

  constructor(
    private route: ActivatedRoute,
    private igService: ImplementationGuideService,
    private sdService: StructureDefinitionService,
    private configService: ConfigService) {

  }

  public async expandProfile(profile: IStructureDefinition) {
    this.expandedProfiles[profile.id] = !this.expandedProfiles[profile.id];

    if (profile.differential && profile.differential.element) {
      profile.differential.element.forEach(e => {
        delete this.editFields[profile.id + e.id + 'short'];
        delete this.editFields[profile.id + e.id + 'definition'];
        delete this.editFields[profile.id + e.id + 'requirements'];
      });
    }

    const editFieldWithWait = (elementId: string, field: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.editFields[profile.id + elementId + field] = true;
          resolve();
        }, 5);
      });
    };

    if (this.expandedProfiles[profile.id]) {
      if (profile.differential && profile.differential.element) {
        for (const element of profile.differential.element) {
          await editFieldWithWait(element.id, 'short');
          await editFieldWithWait(element.id, 'definition');
          await editFieldWithWait(element.id, 'requirements');
        }
      }
    }
  }

  private async init() {
    this.profiles = [];
    this.expandedProfiles = {};
    this.editFields = {};

    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    if (implementationGuideId) {
      const ig = await this.igService.getImplementationGuide(implementationGuideId).toPromise();

      if (identifyRelease(this.configService.fhirConformanceVersion) === Versions.R4) {
        this.implementationGuide = new R4ImplementationGuide(ig);
      } else {
        this.implementationGuide = new STU3ImplementationGuide(ig);
      }

      const profilesBundle = await this.igService.getProfiles(implementationGuideId).toPromise();

      if (profilesBundle && profilesBundle.entry) {
        this.profiles = profilesBundle.entry.map(e => <STU3StructureDefinition | R4StructureDefinition> e.resource);
      }
    }
  }

  async ngOnInit() {
    await this.init();
  }
}
