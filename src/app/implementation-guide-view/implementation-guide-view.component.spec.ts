import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImplementationGuideViewComponent} from './implementation-guide-view.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SafePipe} from '../pipes/safe-pipe';
import {ConfigService} from '../services/config.service';

describe('ImplementationguideViewComponent', () => {
    let component: ImplementationGuideViewComponent;
    let fixture: ComponentFixture<ImplementationGuideViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ImplementationGuideViewComponent,
                SafePipe
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImplementationGuideViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
