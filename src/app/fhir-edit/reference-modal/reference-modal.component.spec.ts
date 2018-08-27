import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditReferenceModalComponent } from './reference-modal.component';

describe('FhirEditReferenceModalComponent', () => {
  let component: FhirEditReferenceModalComponent;
  let fixture: ComponentFixture<FhirEditReferenceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditReferenceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditReferenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
