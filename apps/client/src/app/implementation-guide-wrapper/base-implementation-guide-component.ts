import {BaseComponent} from '../base.component';
import {ImplementationGuide as STU3ImplementationGuide} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {IContactDetail} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';

export class BaseImplementationGuideComponent extends BaseComponent {
  public Globals = Globals;
  public implementationGuide: STU3ImplementationGuide | R4ImplementationGuide;

  protected get packageId() {
    return '';
  }

  protected set packageId(value: string) {
  }

  public get packageIdFormatValid() {
    if (!this.packageId) return true;
    return !!this.packageId.match(/(^hl7\.(fhir|cda)\.(.+?)\.[0-9A-z\-]+$)|(^(?!hl7).+)/gi);
  }

  public get hl7WorkGroup() {
    if (!this.implementationGuide.contact || this.implementationGuide.contact.length === 0) return;

    const contacts = <IContactDetail[]> this.implementationGuide.contact;
    const found = contacts.find(c => {
      return c.telecom && c.telecom.find(t => t.system === 'url' && t.value && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
    });
    const telecom = found ? found.telecom.find(t => t.system === 'url' && t.value && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase())) : undefined;
    return telecom ? telecom.value : '';
  }

  public set hl7WorkGroup(value: string) {
    if (!this.implementationGuide.contact) this.implementationGuide.contact = [];
    const wg = Globals.hl7WorkGroups.find(w => w.url === value);
    const contacts = <IContactDetail[]> this.implementationGuide.contact;
    let found = contacts.find(c => {
      return c.telecom && c.telecom.find(t => t.system === 'url' && t.value && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
    });
    const wgName = wg ? `HL7 International - ${wg.name}` : 'HL7 International Working Group';

    if (!found && value) {
      found = {
        name: wgName,
        telecom: [{
          system: 'url',
          value: value
        }]
      };
      this.implementationGuide.contact.push(found);
    } else if (found && value) {
      found.name = wgName;
      const telecom = found.telecom.find(t => t.system === 'url' && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
      telecom.value = value;
    } else if (found && !value) {
      const index = this.implementationGuide.contact.indexOf(found);
      this.implementationGuide.contact.splice(index, index >= 0 ? 1 : 0);
      if (this.implementationGuide.contact.length === 0) delete this.implementationGuide.contact;
    }
  }
}
