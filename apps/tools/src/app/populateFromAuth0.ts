import {BaseTools} from './baseTools';
import {Practitioner as R4Practitioner, ContactPoint as R4ContactPoint} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {Practitioner as STU3Practitioner, ContactPoint as STU3ContactPoint} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import * as rp from 'request-promise';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';

export interface PopulateFromAuth0Options {
  server: string;
  domain: string;
  token: string;
}

export class PopulateFromAuth0 extends BaseTools {
  readonly options: PopulateFromAuth0Options;
  private queue: (STU3Practitioner | R4Practitioner)[];

  constructor(options: PopulateFromAuth0Options) {
    super();

    this.options = options;
  }

  private getIdentifier(practitioner: STU3Practitioner | R4Practitioner) {
    if (!practitioner || !practitioner.identifier || practitioner.identifier.length === 0) {
      return;
    }

    let identifier = practitioner.identifier[0].value;

    if (!identifier) {
      return;
    }

    if (identifier.indexOf('|') < 0) {
      if (practitioner.identifier[0].system === 'https://auth0.com') {
        identifier = 'auth0|' + identifier;
      } else {
        console.error(`Unknown identifier system ${practitioner.identifier[0].system}`);
        return;
      }
    }

    return identifier;
  }

  private async processNext() {
    if (this.queue.length === 0) {
      return;
    }

    const practitioner = this.queue.pop();
    const identifier = this.getIdentifier(practitioner);

    if (!identifier) {
      await this.processNext();
      return;
    }

    const url = `https://${this.options.domain}.auth0.com/api/v2/users/${identifier}`;
    const options = {
      url: url,
      json: true,
      headers: {
        'Authorization': `Bearer ${this.options.token}`
      }
    };

    let results;

    try {
      results = await rp(options);
    } catch (ex) {
      console.error(`Did not find an Auth0 user for identifier ${identifier}`);
    }

    if (!results) {
      return;
    }

    practitioner.telecom = practitioner.telecom || [];
    let changed = false;
    const telecoms: (STU3ContactPoint | R4ContactPoint)[] = practitioner.telecom;
    const currentEmail = telecoms.find(p => p.system === 'email');

    // Update the email address
    if (!currentEmail && results.email) {
      telecoms.push({
        system: 'email',
        value: `mailto:${results.email}`
      });
      changed = true;
    }

    // TODO: given_name
    // TODO: family_name
    // TODO: phone_number

    if (currentEmail && currentEmail.value && !currentEmail.value.startsWith('mailto:')) {
      currentEmail.value = `mailto:${currentEmail.value}`;
      changed = true;
    }

    if (changed) {
      const updateUrl = buildUrl(this.options.server, 'Practitioner', practitioner.id);
      await rp({
        method: 'PUT',
        url: updateUrl,
        body: JSON.stringify(practitioner)
      });
      console.log(`Updated practitioner ${practitioner.id} with identifier ${identifier}`);
    }

    await this.processNext();
  }

  public async execute() {
    this.queue = <(STU3Practitioner | R4Practitioner)[]> await this.getAllResources(this.options.server, 'Practitioner');
    await this.processNext();
  }
}
