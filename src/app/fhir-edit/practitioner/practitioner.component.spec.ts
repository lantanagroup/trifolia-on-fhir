import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditPractitionerComponent } from './practitioner.component';

describe('FhirEditPractitionerComponent', () => {
  let component: FhirEditPractitionerComponent;
  let fixture: ComponentFixture<FhirEditPractitionerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditPractitionerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditPractitionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
