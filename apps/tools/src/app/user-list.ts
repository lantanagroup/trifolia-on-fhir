import {BaseTools} from './baseTools';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {Bundle, EntryComponent, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {getHumanNamesDisplay} from '../../../../libs/tof-lib/src/lib/helper';
import * as fs from 'fs';

export class UserListOptions {
  fhirServer: string[];
  auth0export?: string;
  tabs = false;
}

interface Auth0User {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  user_id: string;
}

export class UserListCommand extends BaseTools {
  readonly options: UserListOptions;
  private entries: EntryComponent[] = [];
  private auth0users: Auth0User[] = [];

  constructor(options: UserListOptions) {
    super();

    this.options = options;
  }

  private async getNextUser(url: string) {
    const results = await this.httpService.get<Bundle>(url).toPromise();
    const bundle = results.data;

    this.entries = this.entries.concat(bundle.entry || []);

    const foundNextLink = (bundle.link || []).find((link) => link.relation === 'next');

    if (foundNextLink) {
      await this.getNextUser(foundNextLink.url);
    }

    return bundle;
  }

  public async execute() {
    for (let i = 0; i < this.options.fhirServer.length; i++) {
      const fhirServer = this.options.fhirServer[i];

      const startingUrl = buildUrl(fhirServer, 'Practitioner', null, null, {
        'identifier': Globals.authNamespace + '|',
        '_summary': true
      });
      await this.getNextUser(startingUrl);
    }

    const grouped = this.entries.reduce((next, current: EntryComponent) => {
      const practitioner: Practitioner = current.resource;
      const authIdentifier = practitioner.identifier.find((ident) => ident.system === Globals.authNamespace);
      const key = authIdentifier.value;

      if (!next[key]) {
        next[key] = [];
      }

      next[key].push(current);
      return next;
    }, {});

    const identifiers = Object.keys(grouped);

    const results = identifiers
      .map((identifier) => {
        const group: EntryComponent[] = grouped[identifier];
        const firstPractitioner: Practitioner = group[0].resource;
        const foundEmail = (firstPractitioner.telecom || []).find((telecom) => telecom.system === 'email');
        const foundPhone = (firstPractitioner.telecom || []).find((telecom) => telecom.system === 'phone');
        const name = getHumanNamesDisplay(firstPractitioner.name);
        let firstName, lastName;

        if (name.split(' ').length === 2) {
          firstName = name.split(' ')[1];
          lastName = name.split(' ')[0];
        }

        return {
          identifier: identifier,
          name: name,
          email: foundEmail ? foundEmail.value : null,
          phone: foundPhone ? foundPhone.value : null,
          firstName: firstName,
          lastName: lastName
        };
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    if (this.options.auth0export) {
      let content = fs.readFileSync(this.options.auth0export).toString();
      content = '[' + content.replace(/\n/g, ',\n') + ']';
      this.auth0users = <Auth0User[]> JSON.parse(content);

      results.forEach(r => {
        const auth0User = this.auth0users.find(a => a.user_id.indexOf('|' + r.identifier) >= 0);

        if (auth0User) {
          if (!r.email) {
            r.email = auth0User.email;
          }
        }
      });
    }

    console.log(`Total unique users: ${results.length}`);

    if (!this.options.tabs) {
      console.table(results);
    } else {
      results.forEach((r, i) => {
        const cells = [i, r.identifier, r.name, r.firstName, r.lastName, r.email, r.phone];
        console.log(cells.join('\t'));
      });
    }
  }
}
