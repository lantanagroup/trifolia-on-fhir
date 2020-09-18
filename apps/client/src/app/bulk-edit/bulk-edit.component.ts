import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IImplementationGuide, IResourceReference, IStructureDefinition} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import {identifyRelease} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Versions} from 'fhir/fhir';
import {ImplementationGuide as R4ImplementationGuide, StructureDefinition as R4StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide, StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {parseReference} from '../../../../../libs/tof-lib/src/lib/helper';

@Component({
  selector: 'trifolia-fhir-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.css']
})
export class BulkEditComponent implements OnInit {
  public implementationGuide: IImplementationGuide;
  public profiles: (STU3StructureDefinition | R4StructureDefinition)[];

  constructor(
    private route: ActivatedRoute,
    private igService: ImplementationGuideService,
    private sdService: StructureDefinitionService,
    private configService: ConfigService) {

  }

  private getR4ProfileReferences(ig: R4ImplementationGuide): IResourceReference[] {
    if (!ig || !ig.definition || !ig.definition.resource) return [];
    return ig.definition.resource
      .filter(r => r.reference && r.reference.reference)
      .filter(r => {
        const parsedReference = parseReference(r.reference.reference);
        return parsedReference.resourceType === 'StructureDefinition';
      })
      .map(r => r.reference);
  }

  private getSTU3ProfileReferences(ig: STU3ImplementationGuide): IResourceReference[] {
    if (!ig || !ig.package) return [];
    const profileReferences = [];

    ig.package.forEach(p => {
      (p.resource || [])
        .filter(r => r.sourceReference && r.sourceReference.reference)
        .forEach(r => {
          const parsedReference = parseReference(r.sourceReference.reference);

          if (parsedReference.resourceType === 'StructureDefinition') {
            profileReferences.push(r.sourceReference);
          }
        });
    });

    return profileReferences;
  }

  private async getProfiles(profileReferences: IResourceReference[]) {
    const profilePromises = profileReferences.map(pr => {
      const parsedReference = parseReference(pr.reference);
      return this.sdService.getStructureDefinition(parsedReference.id).toPromise();
    });

    const profileResults = await Promise.all(profilePromises);

    return profileResults.map(pr => {
      if (identifyRelease(this.configService.fhirConformanceVersion) === Versions.R4) {
        return new R4StructureDefinition(pr);
      } else {
        return new STU3StructureDefinition(pr);
      }
    });
  }

  private async init() {
    const implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');

    if (implementationGuideId) {
      const ig = await this.igService.getImplementationGuide(implementationGuideId).toPromise();
      let profileReferences: IResourceReference[];

      if (identifyRelease(this.configService.fhirConformanceVersion) === Versions.R4) {
        this.implementationGuide = new R4ImplementationGuide(ig);
        profileReferences = this.getR4ProfileReferences(<R4ImplementationGuide> this.implementationGuide);
      } else {
        this.implementationGuide = new STU3ImplementationGuide(ig);
        profileReferences = this.getSTU3ProfileReferences(<STU3ImplementationGuide> this.implementationGuide);
      }

      if (profileReferences) {
        this.profiles = await this.getProfiles(profileReferences);
      }
    }
  }

  async ngOnInit() {
    await this.init();
  }
}
