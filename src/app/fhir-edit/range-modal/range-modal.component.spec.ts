import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirEditRangeModalComponent} from './range-modal.component';

describe('FhirEditRangeModalComponent', () => {
  let component: FhirEditRangeModalComponent;
  let fixture: ComponentFixture<FhirEditRangeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditRangeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditRangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
