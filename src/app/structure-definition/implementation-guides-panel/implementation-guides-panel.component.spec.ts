import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImplementationGuidesPanelComponent} from './implementation-guides-panel.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ImplementationGuideService} from '../../services/implementation-guide.service';
import {ConfigService} from '../../services/config.service';

describe('ImplementationGuidesPanelComponent', () => {
    let component: ImplementationGuidesPanelComponent;
    let fixture: ComponentFixture<ImplementationGuidesPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ImplementationGuidesPanelComponent],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                ImplementationGuideService,
                ConfigService,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImplementationGuidesPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
