import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceHistoryComponent} from './resource-history.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../services/fhir.service';
import {ConfigService} from '../services/config.service';
import {DiffMatchPatchModule} from 'ng-diff-match-patch';

describe('ResourceHistoryComponent', () => {
    let component: ResourceHistoryComponent;
    let fixture: ComponentFixture<ResourceHistoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceHistoryComponent],
            imports: [
                DiffMatchPatchModule,
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
        fixture = TestBed.createComponent(ResourceHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
