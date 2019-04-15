
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
