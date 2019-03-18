import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirMarkdownComponent} from './markdown.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {ConfigService} from '../../services/config.service';
import {CookieService} from 'angular2-cookie/core';
import {MarkdownComponent} from '../../markdown/markdown.component';

describe('FhirMarkdownComponent', () => {
    let component: FhirMarkdownComponent;
    let fixture: ComponentFixture<FhirMarkdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirMarkdownComponent,
                TooltipIconComponent,
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
                FhirService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirMarkdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
