import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditRatioComponent } from './ratio.component';

describe('FhirEditRatioComponent', () => {
  let component: FhirEditRatioComponent;
  let fixture: ComponentFixture<FhirEditRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
