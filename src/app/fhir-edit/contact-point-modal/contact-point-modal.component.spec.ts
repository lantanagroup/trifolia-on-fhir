import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirEditContactPointModalComponent} from './contact-point-modal.component';

describe('FhirEditContactPointModalComponent', () => {
  let component: FhirEditContactPointModalComponent;
  let fixture: ComponentFixture<FhirEditContactPointModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditContactPointModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditContactPointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
