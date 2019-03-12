
export interface ServerValidationResult {
    severity: 'error' | 'warning' | 'info';
    resourceReference: string;
    details: string;
}