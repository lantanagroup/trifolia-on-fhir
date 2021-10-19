import {BaseTools} from './baseTools';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {Bundle, EntryComponent, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {getHumanNamesDisplay} from '../../../../libs/tof-lib/src/lib/helper';
import {unzip} from 'zlib';

export class UserListOptions {
  fhirServer: string[];
  auth0ApiKey?: string;
  auth0Domain?: string;
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
    let auth0users: Auth0User[];

    if (this.options.auth0ApiKey && this.options.auth0Domain) {
      console.log('Auth0 API Key and Domain provided, requesting export from auth0.com');

      try {
        auth0users = await this.getAuth0Users();
      } catch (ex) {
        console.error('Cannot read from auth0: ' + ex && ex.response ? ex.response.status + ' - ' + ex.response.statusText : ex.message);
        process.exit(1);
      }
    }

    for (let i = 0; i < this.options.fhirServer.length; i++) {
      const fhirServer = this.options.fhirServer[i];
      console.log(`Getting users from FHIR server ${fhirServer}`);

      const startingAuth0Url = buildUrl(fhirServer, 'Practitioner', null, null, {
        'identifier': Globals.authNamespace + '|',
        '_summary': true
      });
      await this.getNextUser(startingAuth0Url);

      const startingTrifoliaUrl = buildUrl(fhirServer, 'Practitioner', null, null, {
        'identifier': Globals.defaultAuthNamespace + '|',
        '_summary': true
      });
      await this.getNextUser(startingTrifoliaUrl);
    }

    console.log('Done getting users. Identifying unique users...');

    const grouped = this.entries.reduce((next, current: EntryComponent) => {
      const practitioner: Practitioner = current.resource;
      const authIdentifier = practitioner.identifier.find((ident) => ident.system === Globals.authNamespace || ident.system === Globals.defaultAuthNamespace);
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
        let firstName, lastName, email;

        if (foundEmail && foundEmail.value) {
          email = foundEmail.value.replace('mailto:', '');
        }

        if (name.split(' ').length === 2) {
          firstName = name.split(' ')[1];
          lastName = name.split(' ')[0];
        }

        return {
          identifier: identifier,
          name: name,
          email: email,
          phone: foundPhone ? foundPhone.value : null,
          firstName: firstName,
          lastName: lastName
        };
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    if (auth0users) {
      results.forEach(r => {
        const auth0User = auth0users.find(a => a.user_id.indexOf('|' + r.identifier) >= 0);

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
      console.log(['Number', 'Identifier', 'Name', 'First Name', 'Last Name', 'Email', 'Phone'].join('\t'));
      results.forEach((r, i) => {
        const cells = [i + 1, r.identifier, r.name, r.firstName, r.lastName, r.email, r.phone];
        console.log(cells.join('\t'));
      });
    }
  }

  private async unzipAuth0Data(auth0Data): Promise<string> {
    return new Promise((resolve, reject) => {
      unzip(auth0Data, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString());
        }
      })
    });
  }

  private async getAuth0Users() {
    const requestHeaders = { headers: { Authorization: `Bearer ${this.options.auth0ApiKey}` }};
    const jobRequestUrl = `https://${this.options.auth0Domain}.auth0.com/api/v2/jobs/users-exports`;
    const jobRequestBody = {
      "format": "json",
      "fields": [
        {"name": "email"},
        {"name": "user_id"}
      ]
    };
    const jobRequestResults = await this.httpService.post(jobRequestUrl, jobRequestBody, requestHeaders).toPromise();
    const jobId = jobRequestResults.data.id;
    let location: string;
    const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    while (!location) {
      const jobStatusUrl = `https://${this.options.auth0Domain}.auth0.com/api/v2/jobs/${jobId}`;
      const jobStatusResult = await this.httpService.get(jobStatusUrl, requestHeaders).toPromise();

      if (jobStatusResult.data && jobStatusResult.data.status === 'completed' && jobStatusResult.data.location) {
        location = jobStatusResult.data.location;
        break;
      }

      await sleep(2000);
      console.log('Waiting for job to complete for two more seconds...');
    }

    const jobDataResponse = await this.httpService.get(location, {responseType: 'arraybuffer'}).toPromise();
    const data = await this.unzipAuth0Data(jobDataResponse.data);

    const auth0Users = data.split('\n').filter(json => json.trim().length > 0).map(json => JSON.parse(json) as Auth0User);
    return auth0Users;
  }
}
