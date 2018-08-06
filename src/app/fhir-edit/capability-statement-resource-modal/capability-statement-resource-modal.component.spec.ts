import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditCapabilityStatementResourceModalComponent } from './capability-statement-resource-modal.component';

describe('FhirEditCapabilityStatementResourceModalComponent', () => {
  let component: FhirEditCapabilityStatementResourceModalComponent;
  let fixture: ComponentFixture<FhirEditCapabilityStatementResourceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditCapabilityStatementResourceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditCapabilityStatementResourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
