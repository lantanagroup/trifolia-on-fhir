import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PublishComponent} from './publish.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {TreeModule} from 'ng2-tree';
import {ConfigService} from '../shared/config.service';
import {FhirService} from '../shared/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {SocketService} from '../shared/socket.service';
import {ExportService} from '../shared/export.service';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {FhirBooleanComponent} from '../fhir-edit/boolean/boolean.component';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';

describe('PublishComponent', () => {
    let component: PublishComponent;
    let fixture: ComponentFixture<PublishComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TooltipIconComponent,
                PublishComponent,
                FhirBooleanComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule,
                TreeModule
            ],
            providers: [
                ConfigService,
                FhirService,
                CookieService,
                SocketService,
                ExportService,
                ImplementationGuideService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PublishComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
