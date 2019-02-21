import {FhirLogic} from './fhirLogic';
import {RestRejection} from './models';

export class AuditEventController extends FhirLogic {
    public update(id: string, data: any, query?: any): Promise<any> {
        return Promise.reject(<RestRejection> { statusCode: 400, message: 'Cannot update audit event records' });
    }

    public delete(id: string): Promise<any> {
        return Promise.reject(<RestRejection> { statusCode: 400, message: 'Cannot delete audit event records' });
    }
}