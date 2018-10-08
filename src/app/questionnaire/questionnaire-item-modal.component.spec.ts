import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditQuestionnaireItemModalComponent } from './questionnaire-item-modal.component';

describe('FhirEditQuestionnaireItemModalComponent', () => {
  let component: FhirEditQuestionnaireItemModalComponent;
  let fixture: ComponentFixture<FhirEditQuestionnaireItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditQuestionnaireItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditQuestionnaireItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
