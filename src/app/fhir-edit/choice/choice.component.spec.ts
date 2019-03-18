import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirChoiceComponent} from './choice.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';
import {FhirIdentifierComponent} from '../identifier/identifier.component';
import {FhirAttachmentComponent} from '../attachment/attachment.component';
import {FhirBooleanComponent} from '../boolean/boolean.component';
import {FhirQuantityComponent} from '../quantity/quantity.component';
import {FhirHumanNameComponent} from '../human-name/human-name.component';
import {FhirPeriodComponent} from '../period/period.component';
import {FhirRangeComponent} from '../range/range.component';
import {FhirRatioComponent} from '../ratio/ratio.component';

describe('FhirChoiceComponent', () => {
    let component: FhirChoiceComponent;
    let fixture: ComponentFixture<FhirChoiceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirChoiceComponent,
                TooltipIconComponent,
                FhirIdentifierComponent,
                FhirAttachmentComponent,
                FhirBooleanComponent,
                FhirQuantityComponent,
                FhirHumanNameComponent,
                FhirPeriodComponent,
                FhirRangeComponent,
                FhirRatioComponent
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
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirChoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
