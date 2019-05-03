import {Coding, DomainResource, HumanName} from './stu3/fhir';
import {ResourceSecurityModel} from './resource-security-model';
import {Globals} from './globals';

export function getErrorString(err: any, body?: any, defaultMessage?: string) {
  if (err && err.error) {
    if (typeof err.error === 'string') {
      return err.error;
    } else if (typeof err.error === 'object') {
      if (err.error.resourceType === 'OperationOutcome') {
        if (err.error.issue && err.error.issue.length > 0 && err.error.issue[0].diagnostics) {
          return err.error.issue[0].diagnostics;
        }
      } else if (err.name === 'RequestError') {
        return err.error.message;
      }
    }
  } else if (err && err.message) {
    return err.message;
  } else if (err && err.data) {
    return err.data;
  } else if (typeof err === 'string') {
    return err;
  } else if (body && body.resourceType === 'OperationOutcome') {
    if (body.issue && body.issue.length > 0 && body.issue[0].diagnostics) {
      return body.issue[0].diagnostics;
    }
  }

  return defaultMessage || 'An unknown error occurred';
}

export function reduceFlatten<T>(callback: (next: T) => any[]) {
  const internalFlatten = (previous: T[], children: T[]) => {
    if (children) {
      children.forEach((child) => {
        previous.push(child);
        internalFlatten(previous, callback(child));
      });
    }
  };

  return (previous: any[], current: T): any[] => {
    internalFlatten(previous, callback(current));
    return previous;
  };
}

export function reduceDistinct<T>(callback: (next: T) => any) {
  return (previous: any[], current: T): any[] => {
    const id = callback(current);
    const previousIds = previous.map(prev => callback(prev));

    if (previousIds.indexOf(id) < 0) {
      previous.push(current);
    }

    return previous;
  };
}

/**
 * Helper function that creates a group from the items based on the returned
 * value of the callback function
 * @param items The items to group
 * @param callback The callback whose return value indicates what the key of each item is
 */
export function groupBy<T>(items: T[], callback: (next: T) => any): { [key: string]: any} {
  const groups = {};

  items.forEach((next) => {
    let key = callback(next);

    if (key) {
      key = key.toString();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(next);
    }
  });

  return groups;
}

export function getResourceSecurity(resource: DomainResource): ResourceSecurityModel[] {
  if (resource && resource.meta && resource.meta.security) {
    return resource.meta.security
      .filter((security) => security.system === Globals.securitySystem)
      .map((security) => {
        const split = security.code.split('|');

        if (split[0] === 'everyone') {
          return <ResourceSecurityModel> {
            type: 'everyone',
            permission: split[1]
          };
        } else if (split.length === 3) {
          return <ResourceSecurityModel> {
            type: split[0],
            id: split[1],
            permission: split[2]
          };
        }
      });
  }

  return [];
}

export function getHumanNameDisplay(humanName: HumanName) {
  if (humanName.family && humanName.given && humanName.given.length > 0) {
    return humanName.family + ', ' + humanName.given[0];
  } else if (humanName.family) {
    return humanName.family;
  } else if (humanName.given && humanName.given.length > 0) {
    return humanName.given[0];
  }
}

export function getHumanNamesDisplay(humanNames: HumanName[]) {
  if (!humanNames || humanNames.length === 0) {
    return 'Unspecified';
  } else {
    return getHumanNameDisplay(humanNames[0]);
  }
}

export function ensureSecurity(resource: DomainResource) {
  if (!resource) {
    return;
  }

  if (!resource.meta) {
    resource.meta = {};
  }

  if (!resource.meta.security) {
    resource.meta.security = [];
  }
}

export function addPermission(resource: DomainResource, type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string): boolean {
  ensureSecurity(resource);

  // Write permissions should always assume read permissions as well
  if (permission === 'write') {
    addPermission(resource, type, 'read', id);
  }

  const securityValue = type === 'everyone' ? `${type}|${permission}` : `${type}|${id}|${permission}`;
  let found: Coding;

  if (resource && resource.meta && resource.meta.security) {
    found = resource.meta.security.find((security) => security.system === Globals.securitySystem && security.code === securityValue);
  }

  if (!found) {
    resource.meta.security.push({
      system: Globals.securitySystem,
      code: securityValue
    });

    return true;
  }

  return false;
}

export function removePermission(resource: DomainResource, type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string): boolean {
  // Assume that if we're removing read permission, they shouldn't have write permission either
  if (permission === 'read') {
    removePermission(resource, type, 'write', id);
  }

  const securityValue = type === 'everyone' ? `${type}|${permission}` : `${type}|${id}|${permission}`;
  let found: Coding;

  if (resource && resource.meta && resource.meta.security) {
    found = resource.meta.security.find((security) => security.system === Globals.securitySystem && security.code === securityValue);
  }

  if (found) {
    const index = resource.meta.security.indexOf(found);
    resource.meta.security.splice(index, 1);
    return true;
  }

  return false;
}
