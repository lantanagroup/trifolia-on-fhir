import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IExtension, IImplementationGuide } from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';
import { ConfigService } from '../../shared/config.service';
import { Resource } from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import { ImplementationGuideService } from '../../shared/implementation-guide.service';
import { IgExampleModel } from '../../../../../../libs/tof-lib/src/lib/ig-example-model';

@Component({
  selector: 'trifolia-fhir-publishing-template',
  templateUrl: './publishing-template.component.html',
  styleUrls: ['./publishing-template.component.css']
})
export class PublishingTemplateComponent implements OnInit {
  @Input() implementationGuide: IImplementationGuide;
  @Output() change = new EventEmitter<IExtension>();
  templateType: 'not-specified' | 'official' | 'custom-uri' | 'uploaded';
  officialTemplate: string;
  officialVersion: string;
  officialVersions: string[];
  customUri: string;
  resources: Resource[];
  examples: IgExampleModel[];
  examples2: IgExampleModel[];

  Globals = Globals;

  constructor(private configService: ConfigService, private igService: ImplementationGuideService) {
  }

  get extension() {
    return (this.implementationGuide.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-pub-template']);
  }

  private async getBinaryResources() {
    if (this.configService.isFhirSTU3) {

    } else if (this.configService.isFhirR4) {
      this.examples = await this.igService.getExamples(this.implementationGuide.id).toPromise();
      this.examples2 = this.examples.filter(i => i.resourceType === 'Composition');
    }
  }

  async init() {
    const ext = this.extension;

    if (this.templateType === 'uploaded') {
      this.templateType = 'uploaded';
    } else {
      if (ext) {
        if (ext.hasOwnProperty('valueUri')) {
          this.templateType = 'custom-uri';
          this.customUri = ext.valueUri;
        } else {
          this.templateType = 'official';

          const hashTagIndex = (ext.valueString || '').indexOf('#');
          if (ext.valueString && hashTagIndex >= 0) {
            this.officialTemplate = ext.valueString.substring(0, hashTagIndex);
            this.officialVersion = ext.valueString.substring(hashTagIndex + 1);
          } else {
            this.officialTemplate = ext.valueString;
            this.officialVersion = 'current';
          }
        }

        this.officialVersions = await this.configService.getTemplateVersions(this.officialTemplate);

        if (this.officialVersion && this.officialVersions && this.officialVersions.indexOf(this.officialVersion) < 0) {
          this.officialVersion = this.officialVersions[0];
        } else if (!this.officialVersion && this.officialVersions && this.officialVersions.length > 0) {
          this.officialVersion = this.officialVersions[0];
        }
      } else {
        this.templateType = 'not-specified';
        this.officialTemplate = undefined;
        this.officialVersion = undefined;
        this.examples2 = undefined;
      }

      this.customUri = ext ? ext.valueUri : undefined;
    }

  }

  async setTemplateType(value: 'not-specified' | 'official' | 'custom-uri' | 'uploaded') {
    this.implementationGuide.extension = this.implementationGuide.extension || [];
    let hasChanged = false;

    if (value === 'not-specified') {
      const ext = this.extension;

      if (ext) {
        const index = this.implementationGuide.extension.indexOf(ext);
        this.implementationGuide.extension.splice(index, 1);
        this.change.emit(this.extension);
      }

      this.templateType = value;
      return;
    }

    if (!this.extension) {
      this.implementationGuide.extension.push({
        url: Globals.extensionUrls['extension-ig-pub-template'],
      });
      hasChanged = true;
    }

    if (value === 'official' && !this.extension.hasOwnProperty('valueString')) {
      delete this.extension.valueUri;
      this.extension.valueString = 'hl7.fhir.template#current';
      hasChanged = true;
    } else if (value === 'custom-uri' && !this.extension.hasOwnProperty('valueUri')) {
      delete this.extension.valueString;
      this.extension.valueUri = 'https://github.com/HL7/ig-template-fhir/archive/master.zip';
      hasChanged = true;
    } else if (value === 'uploaded') {
      this.templateType = value;
      await this.getBinaryResources();
      hasChanged = true;
    }

    await this.init();

    if (hasChanged) {
      this.change.emit(this.extension);
    }
  }

  async officialTemplateChanged(reloadVersions = true) {
    const ext = this.extension;
    let hasChanged = false;
    const newValue = `${this.officialTemplate}#${this.officialVersion || 'current'}`;

    if (ext.hasOwnProperty('valueUri')) {
      delete ext.valueUri;
      hasChanged = true;
    }

    if (ext.valueString !== newValue) {
      ext.valueString = newValue;
      hasChanged = true;
    }

    this.officialVersions = await this.configService.getTemplateVersions(this.officialTemplate);

    if (this.officialVersion && this.officialVersions && this.officialVersions.indexOf(this.officialVersion) < 0) {
      this.officialVersion = this.officialVersions[0];
    } else if (!this.officialVersion && this.officialVersions && this.officialVersions.length > 0) {
      this.officialVersion = this.officialVersions[0];
    }

    if (hasChanged) {
      this.change.emit(this.extension);
    }
  }

  valueUriChanged() {
    const ext = this.extension;
    let hasChanged = false;

    if (ext.hasOwnProperty('valueString')) {
      delete ext.valueString;
      hasChanged = true;
    }

    if (ext.valueUri !== this.customUri) {
      ext.valueUri = this.customUri;
      hasChanged = true;
    }

    if (hasChanged) {
      this.change.emit(this.extension);
    }
  }

  get valueUriValid() {
    if (this.templateType !== 'custom-uri' || !this.customUri) {
      return true;
    }

    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gi;
    return this.customUri.match(expression);
  }

  async ngOnInit() {
    await this.init();
    await this.getBinaryResources();
  }
}
