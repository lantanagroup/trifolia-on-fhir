import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminMessageModalComponent} from './admin-message-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

describe('AdminMessageModalComponent', () => {
    let component: AdminMessageModalComponent;
    let fixture: ComponentFixture<AdminMessageModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminMessageModalComponent],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                NgbActiveModal
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminMessageModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
