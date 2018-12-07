import {inject, TestBed} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SocketService} from './socket.service';
import {ConfigService} from './config.service';
import {PractitionerService} from './practitioner.service';
import {Globals} from '../globals';

describe('AuthService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule,
                NgbModule.forRoot()
            ],
            providers: [
                Globals,
                AuthService,
                SocketService,
                ConfigService,
                PractitionerService
            ]
        });
    });

    it('should be created', inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));
});
