import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirHumanNamesComponent} from './human-names.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

describe('FhirHumanNamesComponent', () => {
    let component: FhirHumanNamesComponent;
    let fixture: ComponentFixture<FhirHumanNamesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FhirHumanNamesComponent],
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
        fixture = TestBed.createComponent(FhirHumanNamesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
