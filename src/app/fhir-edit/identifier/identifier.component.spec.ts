import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirIdentifierComponent} from './identifier.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

describe('FhirIdentifierComponent', () => {
    let component: FhirIdentifierComponent;
    let fixture: ComponentFixture<FhirIdentifierComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FhirIdentifierComponent],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirIdentifierComponent);
        component = fixture.componentInstance;
        component.parentObject = { test: 'blah' };
        component.propertyName = 'someIdentifier';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
