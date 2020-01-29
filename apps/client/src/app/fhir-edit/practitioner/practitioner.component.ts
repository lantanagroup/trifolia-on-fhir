import {Component, Input, OnInit} from '@angular/core';
import {Practitioner} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {IPractitioner} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Component({
  selector: 'trifolia-fhir-practitioner',
  templateUrl: './practitioner.component.html',
  styleUrls: ['./practitioner.component.css']
})
export class FhirPractitionerComponent implements OnInit {
  @Input() practitioner: IPractitioner = new Practitioner();

  public Globals = Globals;

  constructor() {
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

  get firstName() {
    if (this.practitioner.name && this.practitioner.name.length > 0 && this.practitioner.name[0].given && this.practitioner.name[0].given.length > 0) {
      return this.practitioner.name[0].given[0];
    }
  }

  set firstName(value: string) {
    if (value) {
      this.practitioner.name = this.practitioner.name || [];

      if (this.practitioner.name.length === 0) {
        this.practitioner.name.push({});
      }

      this.practitioner.name[0].given = this.practitioner.name[0].given || [];

      if (this.practitioner.name[0].given.length === 0) {
        this.practitioner.name[0].given.push('');
      }

      this.practitioner.name[0].given[0] = value;
    } else if (this.practitioner.name && this.practitioner.name.length > 0 && this.practitioner.name[0].given) {
      if (this.practitioner.name[0].given.length === 1) {
        delete this.practitioner.name[0].given;
      } else if (this.practitioner.name[0].given.length > 1) {
        this.practitioner.name[0].given[0] = '';
      }

      this.checkNames();
    }
  }

  get lastName() {
    if (this.practitioner.name && this.practitioner.name.length > 0) {
      return this.practitioner.name[0].family;
    }
  }

  set lastName(value: string) {
    if (value) {
      this.practitioner.name = this.practitioner.name || [];

      if (this.practitioner.name.length === 0) {
        this.practitioner.name.push({});
      }

      this.practitioner.name[0].family = value;
    } else if (this.practitioner.name && this.practitioner.name.length > 0 && this.practitioner.name[0].family) {
      delete this.practitioner.name[0].family;
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

  get valid(): boolean {
    return !!this.firstName && !!this.lastName && !!this.email;
  }

  ngOnInit() {
  }
}
