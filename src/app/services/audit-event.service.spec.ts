import {inject, TestBed} from '@angular/core/testing';
import {AuditEventService} from './audit-event.service';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Globals} from '../globals';
import {SocketService} from './socket.service';
import {ConfigService} from './config.service';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PractitionerService} from './practitioner.service';

describe('AuditEventService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule,
                NgbModule.forRoot()
            ],
            providers: [
                AuditEventService,
                AuthService,
                Globals,
                SocketService,
                ConfigService,
                PractitionerService
            ]
        });
    });

    it('should be created', inject([AuditEventService], (service: AuditEventService) => {
        expect(service).toBeTruthy();
    }));
});
