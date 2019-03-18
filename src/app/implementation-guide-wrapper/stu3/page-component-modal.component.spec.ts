import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PageComponentModalComponent} from './page-component-modal.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FhirStringComponent} from '../../fhir-edit/string/string.component';
import {FhirReferenceComponent} from '../../fhir-edit/reference/reference.component';
import {FhirSelectSingleCodeComponent} from '../../fhir-edit/select-single-code/select-single-code.component';
import {MarkdownComponent} from '../../markdown/markdown.component';
import {TooltipIconComponent} from '../../tooltip-icon/tooltip-icon.component';
import {FhirService} from '../../services/fhir.service';
import {ConfigService} from '../../services/config.service';

describe('STU3PageComponentModalComponent', () => {
    let component: PageComponentModalComponent;
    let fixture: ComponentFixture<PageComponentModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PageComponentModalComponent,
                FhirStringComponent,
                FhirReferenceComponent,
                FhirSelectSingleCodeComponent,
                MarkdownComponent,
                TooltipIconComponent
            ],
            imports: [
                BrowserModule,
                RouterTestingModule,
                HttpClientModule,
                NgbModule.forRoot(),
                FormsModule
            ],
            providers: [
                NgbActiveModal,
                FhirService,
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageComponentModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
