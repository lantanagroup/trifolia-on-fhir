import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkdownComponent} from './markdown.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

describe('MarkdownComponent', () => {
    let component: MarkdownComponent;
    let fixture: ComponentFixture<MarkdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MarkdownComponent],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MarkdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
