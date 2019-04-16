
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

export function groupBy(items: any[], callback: (next: any) => any): { [key: string]: any} {
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
