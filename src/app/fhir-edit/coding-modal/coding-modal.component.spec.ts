import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditCodingModalComponent } from './coding-modal.component';

describe('FhirEditCodingModalComponent', () => {
  let component: FhirEditCodingModalComponent;
  let fixture: ComponentFixture<FhirEditCodingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditCodingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditCodingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
