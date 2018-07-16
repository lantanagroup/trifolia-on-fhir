import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditHumanNameModalComponent } from './human-name-modal.component';

describe('FhirEditHumanNameModalComponent', () => {
  let component: FhirEditHumanNameModalComponent;
  let fixture: ComponentFixture<FhirEditHumanNameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditHumanNameModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditHumanNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
