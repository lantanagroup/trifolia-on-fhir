export interface FSHMessage {
  message?: string;
  location?: any;
  input?: string;
}

export interface FromFSHModel {
  fhir?: any[];
  errors?: FSHMessage[];
  warnings?: FSHMessage[];
}

export interface ToFSHModel {
  fsh?: string;
  configuration: any;
  errors?: FSHMessage[];
  warnings?: FSHMessage[];
}
