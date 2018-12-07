import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirElementDefinitionTypeModalComponent} from './element-definition-type-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';
import {FhirService} from '../../services/fhir.service';
import {ConfigService} from '../../services/config.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {CookieService} from 'angular2-cookie/core';

describe('FhirElementDefinitionTypeModalComponent', () => {
    let component: FhirElementDefinitionTypeModalComponent;
    let fixture: ComponentFixture<FhirElementDefinitionTypeModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirElementDefinitionTypeModalComponent,
                TooltipIconComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                NgbActiveModal,
                Globals,
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirElementDefinitionTypeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
