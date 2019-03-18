import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NarrativeComponent} from './narrative.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../../services/fhir.service';
import {ConfigService} from '../../services/config.service';
import {AngularEditorModule} from '@kolkov/angular-editor';

describe('NarrativeComponent', () => {
    let component: NarrativeComponent;
    let fixture: ComponentFixture<NarrativeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NarrativeComponent],
            imports: [
                AngularEditorModule,
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                FhirService,
                ConfigService,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NarrativeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
