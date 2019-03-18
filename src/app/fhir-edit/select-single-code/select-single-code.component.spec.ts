import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FhirSelectSingleCodeComponent} from './select-single-code.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../services/fhir.service';
import {HttpClientModule} from '@angular/common/http';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';

describe('FhirSelectSingleCodeComponent', () => {
    let component: FhirSelectSingleCodeComponent;
    let fixture: ComponentFixture<FhirSelectSingleCodeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirSelectSingleCodeComponent,
                TooltipIconComponent
            ],
            imports: [
                NgbModule.forRoot(),
                HttpClientModule,
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
        fixture = TestBed.createComponent(FhirSelectSingleCodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
