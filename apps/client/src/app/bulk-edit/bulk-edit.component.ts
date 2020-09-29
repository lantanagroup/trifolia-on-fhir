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
  public expandedProfileId: string;
  public changedProfiles: { [key: string]: boolean } = {};
  public editFields: { [key: string]: boolean } = {};
  public message: string;
  public loading = false;
  public searchProfileText: string;
  public enabledFields = {
    profileDescription: true,
    profileIntro: true,
    profileNotes: true,
    elementShort: true,
    elementDefinition: true,
    elementRequirements: true
  };

  constructor(
    private route: ActivatedRoute,
    private igService: ImplementationGuideService,
    private sdService: StructureDefinitionService,
    private configService: ConfigService) {

  }

  public get filteredProfiles() {
    if (!this.searchProfileText || !this.profiles) return this.profiles;
    return this.profiles.filter(p => {
      const profileTitle = p.title || '';
      const profileName = p.name || '';
      const profileDescription = p.description || '';
      const profileIntro = p.intro || '';
      const profileNotes = p.notes || '';
      return (profileTitle + profileName + profileDescription + profileIntro + profileNotes).toLowerCase().indexOf(this.searchProfileText.toLowerCase()) >= 0;
    })
  }

  public async toggleExpandProfile(profile: IStructureDefinition) {
    if (this.expandedProfileId === profile.id) {
      this.expandedProfileId = null;
      this.editFields = {};
      return;
    }

    this.expandedProfileId = profile.id;

    const editFieldWithWait = (field: string, elementId?: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.editFields[profile.id + (elementId || '') + field] = true;
          resolve();
        }, 5);
      });
    };

    await editFieldWithWait('description');
    await editFieldWithWait('intro');
    await editFieldWithWait('notes');

    if (profile.differential && profile.differential.element) {
      for (const element of profile.differential.element) {
        await editFieldWithWait('short', element.id);
        await editFieldWithWait('definition', element.id);
        await editFieldWithWait('requirements', element.id);
      }
    }
  }

  private async init() {
    this.loading = true;
    this.profiles = [];
    this.expandedProfileId = null;
    this.editFields = {};
    this.changedProfiles = {};

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

    this.loading = false;
  }

  async ngOnInit() {
    await this.init();
  }
}
