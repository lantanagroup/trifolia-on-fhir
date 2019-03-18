import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ChangeResourceIdModalComponent} from './change-resource-id-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirService} from '../services/fhir.service';
import {RecentItemService} from '../services/recent-item.service';
import {ConfigService} from '../services/config.service';
import {CookieService} from 'angular2-cookie/core';

describe('ChangeResourceIdModalComponent', () => {
    let component: ChangeResourceIdModalComponent;
    let fixture: ComponentFixture<ChangeResourceIdModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChangeResourceIdModalComponent],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                NgbActiveModal,
                FhirService,
                RecentItemService,
                ConfigService,
                CookieService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangeResourceIdModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
