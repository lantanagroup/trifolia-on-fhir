export class BulkUpdateRequestProfile {
  id: string;
  description?: string;
  descriptionOp?: 'add'|'replace'|'remove';
  extension?: any;
  extensionOp?: 'add'|'replace'|'remove';
  diffElement?: any;
  diffElementOp?: 'add'|'replace'|'remove';
}

export class BulkUpdateRequest {
  description?: string;
  descriptionOp?: 'add'|'replace'|'remove';
  page?: any;
  pageOp?: 'add'|'replace'|'remove';
  profiles: BulkUpdateRequestProfile[];
}
