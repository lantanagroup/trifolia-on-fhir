import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirReferenceModalComponent} from './reference-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';
import {FhirService} from '../../services/fhir.service';
import {FhirDisplayPipe} from '../../pipes/fhir-display-pipe';
import {ConfigService} from '../../services/config.service';

describe('FhirReferenceModalComponent', () => {
    let component: FhirReferenceModalComponent;
    let fixture: ComponentFixture<FhirReferenceModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirReferenceModalComponent,
                FhirDisplayPipe
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                Globals,
                FhirService,
                NgbActiveModal,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirReferenceModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
