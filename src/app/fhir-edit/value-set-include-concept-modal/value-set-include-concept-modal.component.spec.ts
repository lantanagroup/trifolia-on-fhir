import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditValueSetIncludeConceptModalComponent } from './value-set-include-concept-modal.component';

describe('FhirEditValueSetIncludeConceptModalComponent', () => {
  let component: FhirEditValueSetIncludeConceptModalComponent;
  let fixture: ComponentFixture<FhirEditValueSetIncludeConceptModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditValueSetIncludeConceptModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditValueSetIncludeConceptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
