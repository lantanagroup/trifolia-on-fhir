import {HttpService} from '@nestjs/common';
import {BaseTools} from './baseTools';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {Bundle, EntryComponent, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {getHumanNamesDisplay} from '../../../../libs/tof-lib/src/lib/helper';

export class UserListOptions {
  fhirServer: string[];
}

export class UserListCommand extends BaseTools {
  readonly options: UserListOptions;
  private entries: EntryComponent[] = [];

  constructor(options: UserListOptions) {
    super();

    this.options = options;
  }

  private async getNext(url: string) {
    const results = await this.httpService.get<Bundle>(url).toPromise();
    const bundle = results.data;

    this.entries = this.entries.concat(bundle.entry || []);

    const foundNextLink = (bundle.link || []).find((link) => link.relation === 'next');

    if (foundNextLink) {
      await this.getNext(foundNextLink.url);
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
      await this.getNext(startingUrl);
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

        return {
          identifier: identifier,
          name: getHumanNamesDisplay(firstPractitioner.name),
          email: foundEmail ? foundEmail.value : null,
          phone: foundPhone ? foundPhone.value : null
        };
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    console.log(`Total unique users: ${results.length}`);
    console.table(results);
  }
}
