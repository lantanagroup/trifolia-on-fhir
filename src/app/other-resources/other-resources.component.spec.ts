import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OtherResourcesComponent} from './other-resources.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../services/fhir.service';
import {ConfigService} from '../services/config.service';
import {Globals} from '../globals';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';

describe('OtherResourcesComponent', () => {
    let component: OtherResourcesComponent;
    let fixture: ComponentFixture<OtherResourcesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OtherResourcesComponent,
                FhirXmlPipe
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                FhirService,
                ConfigService,
                Globals
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OtherResourcesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
