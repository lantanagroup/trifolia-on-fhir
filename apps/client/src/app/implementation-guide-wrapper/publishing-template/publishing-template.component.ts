import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {ConfigService} from '../../shared/config.service';
import {NonFhirResourceService} from '../../shared/non-fhir-resource.service';
import {Template} from '@trifolia-fhir/models';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'trifolia-fhir-publishing-template',
  templateUrl: './publishing-template.component.html',
  styleUrls: ['./publishing-template.component.css']
})
export class PublishingTemplateComponent implements OnInit {
  @Input() resource: any;
  @Input() template: any;
  @Input() disabled = false;
  @Input() save = false;
  @Output() change = new EventEmitter<boolean>();
  templateType: 'not-specified' | 'official' | 'custom-uri' | 'custom-template';
  officialTemplate: string;
  officialVersion: string;
  officialVersions: string[];
  Globals = Globals;
  customTemplate: string;
  customUri: string;


  constructor(private configService: ConfigService, private nonFhirResourceService: NonFhirResourceService) {
  }


  async officialTemplateChanged(reloadVersions = true) {

    const newValue = `${this.officialTemplate}#${this.officialVersion || 'current'}`;

    this.officialVersions = await this.configService.getTemplateVersions(this.officialTemplate);

    if (this.officialVersion && this.officialVersions && this.officialVersions.indexOf(this.officialVersion) < 0) {
      this.officialVersion = this.officialVersions[0];
    } else if (!this.officialVersion && this.officialVersions && this.officialVersions.length > 0) {
      this.officialVersion = this.officialVersions[0];
    }

    this.template['content'] = newValue;
    this.change.emit(true);
  }

  async setTemplateType(type) {

    this.templateType = type;
    this.template['templateType'] = type;

    if (type == 'not-specified') {
      this.template['name'] = '';
      this.template['content'] = '';
    } else if (type == 'official') {
      this.officialTemplate = 'hl7.fhir.template';
      this.officialVersion = 'current';
      this.template['name'] = '';
      this.template['content'] ='hl7.fhir.template#current';
    } else if (type == 'custom-uri') {
      this.template['name'] = '';
      this.customUri = 'https://github.com/HL7/ig-template-fhir/archive/master.zip';
      this.template['content'] = 'https://github.com/HL7/ig-template-fhir/archive/master.zip';
    } else if (type == 'custom-template') {
      this.template['name'] = '';
      this.customTemplate = "";
      this.template['content'] = '';
    }
  //  await this.init();
    this.change.emit(true);
  }

  valueUriChanged() {
    this.template['content'] = this.customUri;
    this.template['name'] = '';
    this.template.templateType = 'custom-uri';
    this.change.emit(true);
  }


  get valueUriValid() {
    if (this.templateType !== 'custom-uri' || !this.customUri) {
      return true;
    }
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gi;
    this.template.templateType = 'custom-uri';
    return this.customUri.match(expression);
  }

  get title() {
    return this.save ? 'Upload/Save' : 'Upload';
  }

  saveTemplate(template) {
    this.nonFhirResourceService.save(template.id, template, this.resource.id).subscribe({
      next: (temp: Template) => {
        this.template = temp;
      },
      error: (err) => {
        console.log('Error is' + err);
      }
    });
  }

  public upload(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const result = e.target.result;
      const output = [];
      const { fromCharCode } = String;
      try {
        let buffer = new Uint8Array(result);
        for (let i = 0, { length } = buffer; i < length; i++) output.push(fromCharCode(buffer[i]));
        let b64 = btoa(output.join(''));
        this.template.content = b64;
        if (this.save) this.saveTemplate(this.template);
        this.change.emit(true);
      } catch (ex) {
        console.error(ex);
      }
    };
    this.template.name = file.name;
    this.customTemplate = file.name;
    this.template.templateType = 'custom-template';
    reader.readAsArrayBuffer(file);
  }

  async init() {
    if (this.template && !!this.template.templateType) {
      this.templateType = this.template.templateType;
      if (this.template.templateType && this.template.templateType == 'custom-uri') {
        this.customUri = this.template.content;
      } else if (this.template.templateType && this.template.templateType == 'custom-template') {
        this.customTemplate = this.template.name;
      } else if (this.template.templateType && this.template.templateType == 'official') {
        let content = this.template.content;
        const hashTagIndex = (content || '').indexOf('#');
        if (typeof content === 'string' && hashTagIndex >= 0) {
          this.officialTemplate = content.substring(0, hashTagIndex);
          this.officialVersion = content.substring(hashTagIndex + 1);
        } else {
          this.officialTemplate = content;
          this.officialVersion = 'current';
        }
      }
      this.officialVersions = await this.configService.getTemplateVersions(this.officialTemplate);

      if (this.officialVersion && this.officialVersions && this.officialVersions.indexOf(this.officialVersion) < 0) {
        this.officialVersion = this.officialVersions[0];
      } else if (!this.officialVersion && this.officialVersions && this.officialVersions.length > 0) {
        this.officialVersion = this.officialVersions[0];
      }

    }
    else {
      this.templateType = "not-specified";
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.init();
  }


  async ngOnInit() {
    await this.init();
  }

}
