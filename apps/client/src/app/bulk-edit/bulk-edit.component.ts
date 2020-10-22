import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IImplementationGuide, IStructureDefinition} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import {identifyRelease} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Versions} from 'fhir/fhir';
import {ImplementationGuide as R4ImplementationGuide, StructureDefinition as R4StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide, StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {StructureDefinitionService} from '../shared/structure-definition.service';

@Component({
  selector: 'trifolia-fhir-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.css']
})
export class BulkEditComponent implements OnInit {
  public implementationGuide: IImplementationGuide;
  public profiles: (STU3StructureDefinition | R4StructureDefinition)[];
  public expandedElementsProfileId: string;
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

  private editFieldWithWait(profileId: string, field: string, elementId?: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.editFields[profileId + (elementId || '') + field] = true;
        resolve();
      }, 5);
    });
  };

  public async toggleExpandElementsProfile(profile: IStructureDefinition) {
    if (this.expandedElementsProfileId === profile.id) {
      this.expandedElementsProfileId = null;
      this.editFields = {};
      return;
    }

    this.expandedElementsProfileId = profile.id;

    if (profile.differential && profile.differential.element) {
      for (const element of profile.differential.element) {
        await this.editFieldWithWait(profile.id, 'short', element.id);
        await this.editFieldWithWait(profile.id, 'definition', element.id);
        await this.editFieldWithWait(profile.id, 'requirements', element.id);
      }
    }
  }

  private async init() {
    this.loading = true;
    this.profiles = [];
    this.expandedElementsProfileId = null;
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
    this.changeTab('profiles');
  }

  public async changeTab(tabId: 'profiles'|'elements'|'pages'|any) {
    this.expandedElementsProfileId = null;
    this.editFields = {};

    if (tabId === 'profiles') {
      for (const profile of this.profiles) {
        await this.editFieldWithWait(profile.id, 'description');
        await this.editFieldWithWait(profile.id, 'intro');
        await this.editFieldWithWait(profile.id, 'notes');
      }
    }
  }

  async ngOnInit() {
    await this.init();
  }
}
