import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirCapabilityStatementResourceModalComponent} from './capability-statement-resource-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirSelectSingleCodeComponent} from '../select-single-code/select-single-code.component';
import {FhirStringComponent} from '../string/string.component';
import {FhirBooleanComponent} from '../boolean/boolean.component';
import {FhirReferenceComponent} from '../reference/reference.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConfigService} from '../../services/config.service';
import {FhirService} from '../../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirMarkdownComponent} from '../markdown/markdown.component';
import {MarkdownComponent} from '../../markdown/markdown.component';

describe('FhirCapabilityStatementResourceModalComponent', () => {
    let component: FhirCapabilityStatementResourceModalComponent;
    let fixture: ComponentFixture<FhirCapabilityStatementResourceModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirCapabilityStatementResourceModalComponent,
                FhirSelectSingleCodeComponent,
                FhirStringComponent,
                FhirBooleanComponent,
                FhirReferenceComponent,
                TooltipIconComponent,
                FhirMarkdownComponent,
                MarkdownComponent
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
                ConfigService,
                FhirService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirCapabilityStatementResourceModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
