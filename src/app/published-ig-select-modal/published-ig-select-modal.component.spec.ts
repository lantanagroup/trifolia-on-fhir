import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PublishedIgSelectModalComponent} from './published-ig-select-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ImplementationGuideService} from '../shared/implementation-guide.service';

describe('PublishedIgSelectModalComponent', () => {
    let component: PublishedIgSelectModalComponent;
    let fixture: ComponentFixture<PublishedIgSelectModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PublishedIgSelectModalComponent],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                ImplementationGuideService,
                NgbActiveModal
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PublishedIgSelectModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
