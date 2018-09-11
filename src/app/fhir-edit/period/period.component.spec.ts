import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirEditPeriodComponent} from './period.component';

describe('FhirEditPeriodComponent', () => {
  let component: FhirEditPeriodComponent;
  let fixture: ComponentFixture<FhirEditPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
