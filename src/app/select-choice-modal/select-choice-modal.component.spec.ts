import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectChoiceModalComponent} from './select-choice-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../services/fhir.service';
import {ConfigService} from '../services/config.service';

describe('SelectChoiceModalComponent', () => {
    let component: SelectChoiceModalComponent;
    let fixture: ComponentFixture<SelectChoiceModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectChoiceModalComponent],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                FhirService,
                NgbActiveModal,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectChoiceModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
