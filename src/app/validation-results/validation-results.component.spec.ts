import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidationResultsComponent} from './validation-results.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

describe('ValidationResultsComponent', () => {
    let component: ValidationResultsComponent;
    let fixture: ComponentFixture<ValidationResultsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ValidationResultsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValidationResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
