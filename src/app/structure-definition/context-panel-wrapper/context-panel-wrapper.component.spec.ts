import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContextPanelWrapperComponent} from './context-panel-wrapper.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {Globals} from '../../globals';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';
import {ContextPanelStu3Component} from './stu3/context-panel-stu3.component';
import {ContextPanelR4Component} from './r4/context-panel-r4.component';
import {NgModule} from '@angular/core';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirStringComponent} from '../../fhir-edit/string/string.component';

describe('ContextPanelWrapperComponent', () => {
    let component: ContextPanelWrapperComponent;
    let fixture: ComponentFixture<ContextPanelWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContextPanelWrapperComponent],
            imports: [TestContextPanelWrapperModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContextPanelWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@NgModule({
    declarations: [
        ContextPanelStu3Component,
        ContextPanelR4Component,
        TooltipIconComponent,
        FhirStringComponent
    ],
    entryComponents: [
        ContextPanelStu3Component,
        ContextPanelR4Component
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
        CookieService
    ]
})
export class TestContextPanelWrapperModule { }
