import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditCodesystemConceptModalComponent } from './codesystem-concept-modal.component';

describe('FhirEditCodesystemConceptModalComponent', () => {
  let component: FhirEditCodesystemConceptModalComponent;
  let fixture: ComponentFixture<FhirEditCodesystemConceptModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditCodesystemConceptModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditCodesystemConceptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
