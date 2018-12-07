import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationDefinitionParameterModalComponent} from './operation-definition-parameter-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../services/fhir.service';
import {Globals} from '../globals';
import {FhirReferenceComponent} from '../fhir-edit/reference/reference.component';
import {ConfigService} from '../services/config.service';

describe('OperationDefinitionParameterModalComponent', () => {
    let component: OperationDefinitionParameterModalComponent;
    let fixture: ComponentFixture<OperationDefinitionParameterModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OperationDefinitionParameterModalComponent,
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
        fixture = TestBed.createComponent(OperationDefinitionParameterModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
