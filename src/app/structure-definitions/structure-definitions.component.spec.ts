import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StructureDefinitionsComponent} from './structure-definitions.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {StructureDefinitionService} from '../services/structure-definition.service';
import {ConfigService} from '../services/config.service';
import {FhirService} from '../services/fhir.service';
import {FileService} from '../services/file.service';
import {TooltipIconComponent} from '../tooltip-icon/tooltip-icon.component';
import {CookieService} from 'angular2-cookie/core';

describe('StructureDefinitionsComponent', () => {
    let component: StructureDefinitionsComponent;
    let fixture: ComponentFixture<StructureDefinitionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                StructureDefinitionsComponent,
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
                ImplementationGuideService,
                StructureDefinitionService,
                ConfigService,
                FhirService,
                FileService,
                CookieService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureDefinitionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
