import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserComponent} from './user.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {PractitionerService} from '../services/practitioner.service';
import {AuthService} from '../services/auth.service';
import {Globals} from '../globals';
import {SocketService} from '../services/socket.service';
import {ConfigService} from '../services/config.service';
import {RawResourceComponent} from '../raw-resource/raw-resource.component';
import {FhirPractitionerComponent} from '../fhir-edit/practitioner/practitioner.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {FhirSelectSingleCodeComponent} from '../fhir-edit/select-single-code/select-single-code.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {FhirStringComponent} from '../fhir-edit/string/string.component';
import {FhirHumanNamesComponent} from '../fhir-edit/human-names/human-names.component';

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UserComponent,
                RawResourceComponent,
                FhirPractitionerComponent,
                FhirXmlPipe,
                TooltipIconComponent,
                FhirStringComponent,
                FhirSelectSingleCodeComponent,
                FhirHumanNamesComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                PractitionerService,
                AuthService,
                SocketService,
                ConfigService,
                Globals
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
