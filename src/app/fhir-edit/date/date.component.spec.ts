import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirDateComponent } from './date.component';

describe('FhirDateComponent', () => {
  let component: FhirDateComponent;
  let fixture: ComponentFixture<FhirDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
