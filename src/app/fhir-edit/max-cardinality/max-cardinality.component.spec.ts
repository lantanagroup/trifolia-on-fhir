import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirMaxCardinalityComponent} from './max-cardinality.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

describe('FhirMaxCardinalityComponent', () => {
    let component: FhirMaxCardinalityComponent;
    let fixture: ComponentFixture<FhirMaxCardinalityComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FhirMaxCardinalityComponent],
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
        fixture = TestBed.createComponent(FhirMaxCardinalityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
