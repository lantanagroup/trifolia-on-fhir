import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsModalComponent} from './settings-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../services/config.service';

describe('SettingsModalComponent', () => {
    let component: SettingsModalComponent;
    let fixture: ComponentFixture<SettingsModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SettingsModalComponent
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
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
