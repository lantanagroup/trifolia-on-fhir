import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirEditAttachmentModalComponent} from './attachment-modal.component';

describe('FhirEditAttachmentModalComponent', () => {
  let component: FhirEditAttachmentModalComponent;
  let fixture: ComponentFixture<FhirEditAttachmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditAttachmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditAttachmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
