import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IImplementationGuide, IStructureDefinition} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {ConfigService} from '../shared/config.service';
import {identifyRelease} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Versions} from 'fhir/fhir';
import {ImplementationGuide as R4ImplementationGuide, StructureDefinition as R4StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide, StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as R5ImplementationGuide, StructureDefinition as R5StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r5/fhir';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {BulkUpdateRequest, BulkUpdateRequestProfile} from '../../../../../libs/tof-lib/src/lib/bulk-update-request';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';

@Component({
  selector: 'trifolia-fhir-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.css']
})
export class BulkEditComponent implements OnInit {
  public originalImplementationGuide: IImplementationGuide;
  public implementationGuide: IImplementationGuide;
  public originalProfiles: IStructureDefinition[];
  public profiles: IStructureDefinition[];
  public expandedElementsProfileId: string;
  public changedProfiles: { [key: string]: boolean } = {};
  public changedPages: { [fileName: string]: boolean } = {};
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
        this.originalImplementationGuide = new R4ImplementationGuide(ig);
        this.implementationGuide = new R4ImplementationGuide(ig);
      } else {
        this.originalImplementationGuide = new STU3ImplementationGuide(ig);
        this.implementationGuide = new STU3ImplementationGuide(ig);
      }

      const profilesBundle = await this.igService.getProfiles(implementationGuideId).toPromise();

      if (profilesBundle && profilesBundle.entry) {
        this.profiles = profilesBundle.entry.map(e => {
          if (this.configService.isFhirSTU3) {
            return new STU3StructureDefinition(e.resource);
          } else if (this.configService.isFhirR4) {
            return new R4StructureDefinition(e.resource);
          } else if (this.configService.isFhirR5) {
            return new R5StructureDefinition(e.resource);
          } else {
            throw new Error(`Unexpected FHIR version: ${this.configService.fhirConformanceVersion}`);
          }
        });
        this.originalProfiles = this.profiles.map(p => {
          if (this.configService.isFhirSTU3) {
            return new STU3StructureDefinition(p);
          } else if (this.configService.isFhirR4) {
            return new R4StructureDefinition(p);
          } else if (this.configService.isFhirR5) {
            return new R5StructureDefinition(p);
          } else {
            throw new Error(`Unexpected FHIR version: ${this.configService.fhirConformanceVersion}`);
          }
        });
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

  async save() {
    this.message = 'Saving...';
    const bulkUpdateRequest = new BulkUpdateRequest();

    const getOp = (old, current) => {
      if(old && current) return 'replace';
      else if(old && !current) return 'remove';
      else if(!old && current) return 'add';
      else return undefined;
    };

    try {
      if (this.configService.isFhirR5) {
        const originalIg = <R5ImplementationGuide> this.originalImplementationGuide;
        const ig = <R5ImplementationGuide> this.implementationGuide;
        bulkUpdateRequest.page = ig.definition.page;
        bulkUpdateRequest.pageOp = getOp(originalIg.definition ? originalIg.definition.page : undefined, ig.definition ? ig.definition.page : undefined);
      } else if (this.configService.isFhirR4) {
        const originalIg = <R4ImplementationGuide> this.originalImplementationGuide;
        const ig = <R4ImplementationGuide> this.implementationGuide;
        bulkUpdateRequest.page = ig.definition.page;
        bulkUpdateRequest.pageOp = getOp(originalIg.definition ? originalIg.definition.page : undefined, ig.definition ? ig.definition.page : undefined);
      } else if (this.configService.isFhirSTU3) {
        const originalIg = <STU3ImplementationGuide> this.originalImplementationGuide;
        const ig = <STU3ImplementationGuide> this.implementationGuide;
        bulkUpdateRequest.page = ig.page;
        bulkUpdateRequest.pageOp = getOp(originalIg.page, ig.page);
      } else {
        throw new Error(`Unexpected FHIR version: ${this.configService.fhirConformanceVersion}`);
      }

      bulkUpdateRequest.profiles = this.profiles
        .filter(profile => {
          return this.changedProfiles[profile.id];
        })
        .map((profile, profileIndex) => {
          const originalProfile = this.originalProfiles.find(p => p.id === profile.id);
          return <BulkUpdateRequestProfile> {
            id: profile.id,
            description: profile.description,
            descriptionOp: getOp(originalProfile.description, profile.description),
            extension: profile.extension,
            extensionOp: getOp(originalProfile.extension, profile.extension),
            diffElement: profile.differential && profile.differential.element ? profile.differential.element : null,
            diffElementOp: getOp(originalProfile.differential, profile.differential)
          };
        });

      await this.igService.bulkUpdate(this.implementationGuide.id, bulkUpdateRequest).toPromise();

      this.changedProfiles = {};
      this.changedPages = {};

      this.message = 'Done saving';
      setTimeout(() => this.message = '', 5000);
    } catch (ex) {
      this.message = `Error while saving: ${getErrorString(ex)}`;
    }
  }

  async ngOnInit() {
    await this.init();
  }
}
