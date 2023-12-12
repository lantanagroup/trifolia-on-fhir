import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {IContactDetail, IExtension, IImplementationGuide} from '@trifolia-fhir/tof-lib';
import {AuthService} from '../../shared/auth.service';
import {Extension} from '@trifolia-fhir/r4';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-ig-work-group',
  templateUrl: './work-group.component.html',
  styleUrls: ['./work-group.component.css']
})
export class WorkGroupComponent implements OnInit {
  @Input() implementationGuide;
  public igChanging: EventEmitter<boolean> = new EventEmitter<boolean>();
  public Globals = Globals;


  constructor(protected authService: AuthService) {

  }

  public get hl7WorkGroup() {
    if (!this.implementationGuide.contact || this.implementationGuide.contact.length === 0) return;

    const contacts = <IContactDetail[]>this.implementationGuide.contact;
    const found = contacts.find(c => {
      return c.telecom && c.telecom.find(t => t.system === 'url' && t.value && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
    });
    const telecom = found ? found.telecom.find(t => t.system === 'url' && t.value && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase())) : undefined;
    return telecom ? telecom.value : '';
  }

  public set hl7WorkGroup(value: any) {

    const wg = Globals.hl7WorkGroups.find(w => w.url === value);

    // set contact
    if (!this.implementationGuide.contact) this.implementationGuide.contact = [];
    const contacts = <IContactDetail[]>this.implementationGuide.contact;
    let found = contacts.find(c => {
      return c.telecom && c.telecom.find(t => t.system === 'url' && t.value && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
    });
    const wgName = wg ? `HL7 International - ${wg.name}` : 'HL7 International Working Group';

    if (!found && wg.url) {
      found = {
        name: wgName,
        telecom: [{
          system: 'url',
          value: wg.url
        }]
      };
      this.implementationGuide.contact.push(found);
    } else if (found && value) {
      found.name = wgName;
      const telecom = found.telecom.find(t => t.system === 'url' && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
      telecom.value = wg.url;
    } else if (found && !value) {
      const index = this.implementationGuide.contact.indexOf(found);
      this.implementationGuide.contact.splice(index, index >= 0 ? 1 : 0);
      if (this.implementationGuide.contact.length === 0) delete this.implementationGuide.contact;
    }

    // set extension
    if (!this.implementationGuide.extension) this.implementationGuide.extension = [];
    let foundExt: Extension = this.implementationGuide.extension.find(e => {
      let b = e.url == 'http://hl7.org/fhir/StructureDefinition/structuredefinition-wg';
      return b;
    });

    if (!foundExt && value) {
      foundExt = <Extension>{
        url: 'http://hl7.org/fhir/StructureDefinition/structuredefinition-wg',
        valueCode: wg.code
      };
      this.implementationGuide.extension.push(foundExt);
    } else if (foundExt && value) {
      foundExt.valueCode = wg.code;
    } else if (foundExt && !value) {
      const index = this.implementationGuide.extension.indexOf(foundExt);
      this.implementationGuide.extension.splice(index, index >= 0 ? 1 : 0);
      if (this.implementationGuide.extension.length === 0) delete this.implementationGuide.extension;
    }
  }


  ngOnInit() {

    if (!!this.implementationGuide) {

      // verify that if contact exists extension exists or create extension
      if (!this.implementationGuide.contact) this.implementationGuide.contact = [];
      const contacts = <IContactDetail[]>this.implementationGuide.contact;
      let foundContact = contacts.find(c => {
        return c.telecom && c.telecom.find(t => t.system === 'url' && t.value && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
      });
      if(foundContact){
        const telecom = foundContact.telecom.find(t => t.system === 'url' && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
        const value = telecom.value;
        const wg = Globals.hl7WorkGroups.find(w => w.url === value);

        if (!this.implementationGuide.extension) this.implementationGuide.extension = [];

        let foundExt: Extension = this.implementationGuide.extension.find(e => {
          let b = e.url == 'http://hl7.org/fhir/StructureDefinition/structuredefinition-wg' && e.valueCode == wg.code;
          return b;
        });
        if (!foundExt && value) {
          foundExt = <Extension>{
            url: 'http://hl7.org/fhir/StructureDefinition/structuredefinition-wg',
            valueCode: wg.code
          };
          this.implementationGuide.extension.push(foundExt);
        }
      } else {
        // if extensions exists create contact
        if (!this.implementationGuide.extension) this.implementationGuide.extension = [];
        let foundExt: Extension = this.implementationGuide.extension.find(e => {
          return e.url == 'http://hl7.org/fhir/StructureDefinition/structuredefinition-wg';
          const value = foundExt.url;

          if (foundExt) {
             const wg = Globals.hl7WorkGroups.find(w => w.url === value);
             const wgName = wg ? `HL7 International - ${wg.name}` : 'HL7 International Working Group';
              foundContact = {
                name: wgName,
                telecom: [{
                  system: 'url',
                  value: foundExt.valueCode
                }]
              };
              this.implementationGuide.contact.push(foundContact);
            }

        });
      }
    }
  }
}
