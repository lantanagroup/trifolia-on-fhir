import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterModalComponent} from './parameter-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {Globals} from '../../globals';
import {FhirReferenceComponent} from '../../fhir-edit/reference/reference.component';
import {ConfigService} from '../../services/config.service';

describe('OperationDefinitionParameterModalComponent', () => {
    let component: ParameterModalComponent;
    let fixture: ComponentFixture<ParameterModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ParameterModalComponent,
                FhirReferenceComponent
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
                Globals,
                ConfigService,
                NgbActiveModal
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ParameterModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
