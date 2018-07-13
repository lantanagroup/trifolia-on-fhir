import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditCodeableConceptModalComponent } from './codeable-concept.component';

describe('FhirEditCodeableConceptModalComponent', () => {
  let component: FhirEditCodeableConceptModalComponent;
  let fixture: ComponentFixture<FhirEditCodeableConceptModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditCodeableConceptModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditCodeableConceptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
