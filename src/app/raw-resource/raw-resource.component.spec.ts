import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RawResourceComponent} from './raw-resource.component';
import {FhirXmlPipe} from '../pipes/fhir-xml-pipe';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../services/fhir.service';
import {ConfigService} from '../services/config.service';
import {Globals} from '../globals';

describe('RawResourceComponent', () => {
    let component: RawResourceComponent;
    let fixture: ComponentFixture<RawResourceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RawResourceComponent,
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
        fixture = TestBed.createComponent(RawResourceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
