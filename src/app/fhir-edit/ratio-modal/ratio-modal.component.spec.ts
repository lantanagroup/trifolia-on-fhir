import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FhirEditRatioModalComponent } from './ratio-modal.component';

describe('FhirEditRatioModalComponent', () => {
  let component: FhirEditRatioModalComponent;
  let fixture: ComponentFixture<FhirEditRatioModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditRatioModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditRatioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
