import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirReferenceComponent} from './reference.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Globals} from '../../globals';

describe('FhirReferenceComponent', () => {
    let component: FhirReferenceComponent;
    let fixture: ComponentFixture<FhirReferenceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FhirReferenceComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                Globals
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FhirReferenceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
