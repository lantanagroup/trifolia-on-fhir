export class BaseTools {

  constructor() {
  }

  protected printError(err) {
    if (err.error && err.error.resourceType === 'OperationOutcome') {
      if (err.error.issue && err.error.issue.length > 0) {
        err.error.issue.forEach((issue: any) => console.error(issue.diagnostics));
      } else if (err.err.text && err.error.text.div) {
        console.error(err.error.text.div);
      } else {
        console.error(err);
      }
    } else {
      console.error(err);
    }
  }
}
