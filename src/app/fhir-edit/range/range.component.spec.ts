import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirEditRangeComponent} from './range.component';

describe('FhirEditRangeComponent', () => {
  let component: FhirEditRangeComponent;
  let fixture: ComponentFixture<FhirEditRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
