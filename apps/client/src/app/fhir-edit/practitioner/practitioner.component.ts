import {Component, Input, OnInit} from '@angular/core';
import {Practitioner} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {IPractitioner} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {ConfigService} from '../../shared/config.service';

@Component({
  selector: 'trifolia-fhir-practitioner',
  templateUrl: './practitioner.component.html',
  styleUrls: ['./practitioner.component.css']
})
export class FhirPractitionerComponent implements OnInit {
  @Input() practitioner: IPractitioner = new Practitioner();

  public Globals = Globals;

  constructor(public configService: ConfigService) {
  }

  private checkNames() {
    if (this.practitioner.name && this.practitioner.name.length > 0) {
      this.practitioner.name.forEach(n => {
        if (n.given) {
          for (let i = n.given.length - 1; i >= 0; i--) {
            if (!n.given[i]) {
              n.given.splice(i, 1);
            }
          }
        }
      });

      for (let i = this.practitioner.name.length - 1; i >= 0; i--) {
        if (Object.keys(this.practitioner.name[i]).length === 0) {
          this.practitioner.name.splice(i, 1);
        }
      }

      if (this.practitioner.name.length === 0) {
        delete this.practitioner.name;
      }
    }
  }

  get alias() {
    const aliasName = (this.practitioner.name || []).find(n => n.use === 'anonymous');

    if (aliasName) {
      return aliasName.text;
    }
  }

  set alias(value: string) {
    this.practitioner.name = this.practitioner.name || [];
    let aliasName = this.practitioner.name.find(n => n.use === 'anonymous');

    if (value) {
      if (!aliasName) {
        aliasName = {
          use: 'anonymous'
        };
        this.practitioner.name.push(aliasName);
      }

      aliasName.text = value;
    } else if (aliasName && aliasName.text) {
      this.practitioner.name.splice(this.practitioner.name.indexOf(aliasName), 1);
    }
  }

  get firstName() {
    const officialName = (this.practitioner.name || []).find(n => n.use === 'official' || !n.use);
    if (officialName && officialName.given && officialName.given.length > 0) {
      return officialName.given[0];
    }
  }

  set firstName(value: string) {
    this.practitioner.name = this.practitioner.name || [];
    let officialName = this.practitioner.name.find(n => n.use === 'official' || !n.use);

    if (value) {
      if (!officialName) {
        officialName = {
          use: 'official'
        };
        this.practitioner.name.push(officialName);
      }

      officialName.given = officialName.given || [];

      if (officialName.given.length === 0) {
        officialName.given.push('');
      }

      officialName.given[0] = value;
    } else if (officialName && officialName.given) {
      if (officialName.given.length === 1) {
        delete officialName.given;
      } else if (officialName.given.length > 1) {
        officialName.given[0] = '';
      }

      this.checkNames();
    }
  }

  get lastName() {
    const officialName = (this.practitioner.name || []).find(n => n.use === 'official' || !n.use);
    if (officialName && officialName.family) {
      return officialName.family;
    }
  }

  set lastName(value: string) {
    this.practitioner.name = this.practitioner.name || [];
    let officialName = this.practitioner.name.find(n => n.use === 'official' || !n.use);

    if (value) {
      if (!officialName) {
        officialName = {
          use: 'official'
        };
        this.practitioner.name.push(officialName);
      }

      officialName.family = value;
    } else if (officialName && officialName.family) {
      delete officialName.family;
      this.checkNames();
    }
  }

  get email() {
    const found = (this.practitioner.telecom || []).find(t => t.system === 'email');

    if (found && found.value) {
      if (found.value.startsWith('mailto:')) {
        return found.value.substring('mailto:'.length);
      } else {
        return found.value;
      }
    }
  }

  set email(value: string) {
    if (value) {
      this.practitioner.telecom = this.practitioner.telecom || [];
      let found = this.practitioner.telecom.find(t => t.system === 'email');

      if (value.startsWith('mailto:')) {
        value = value.substring('mailto:'.length);
      }

      if (!found) {
        found = {
          system: 'email',
          value: `mailto:${value}`
        };
        this.practitioner.telecom.push(found);
      } else {
        found.value = `mailto:${value}`;
      }
    } else {
      const found = (this.practitioner.telecom || []).find(t => t.system === 'email');

      if (found) {
        const index = this.practitioner.telecom.indexOf(found);
        this.practitioner.telecom.splice(index, 1);
      }
    }
  }

  get phone() {
    if (this.practitioner.telecom) {
      const found = this.practitioner.telecom.find(t => t.system === 'phone');

      if (found) {
        return found.value;
      }
    }
  }

  set phone(value: string) {
    if (value) {
      this.practitioner.telecom = this.practitioner.telecom || [];
      let found = this.practitioner.telecom.find(t => t.system === 'phone');

      if (!found) {
        found = {
          system: 'phone',
          value: value
        };
        this.practitioner.telecom.push(found);
      } else {
        found.value = value;
      }
    } else if (this.practitioner.telecom) {
      let found = this.practitioner.telecom.find(t => t.system === 'phone');

      if (found) {
        const index = this.practitioner.telecom.indexOf(found);
        this.practitioner.telecom.splice(index, 1);
      }
    }
  }

  get announcements() {
    if (this.practitioner.extension) {
      const found = this.practitioner.extension.find(e => e.url === Globals.extensionUrls['extension-practitioner-announcements']);

      if (found) {
        return found.valueBoolean;
      }
    }

    return false;
  }

  set announcements(value: boolean) {
    this.practitioner.extension = this.practitioner.extension || [];
    let found = this.practitioner.extension.find(e => e.url === Globals.extensionUrls['extension-practitioner-announcements']);

    if (!found) {
      found = {
        url: Globals.extensionUrls['extension-practitioner-announcements'],
        valueBoolean: value
      };
      this.practitioner.extension.push(found);
    } else {
      found.valueBoolean = value;
    }
  }

  get valid(): boolean {
    return !!this.firstName && !!this.lastName && !!this.email;
  }

  ngOnInit() {
  }
}
