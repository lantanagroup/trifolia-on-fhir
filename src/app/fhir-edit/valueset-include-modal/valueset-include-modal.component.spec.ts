import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirEditValuesetIncludeModalComponent } from './valueset-include-modal.component';

describe('FhirEditValuesetIncludeModalComponent', () => {
  let component: FhirEditValuesetIncludeModalComponent;
  let fixture: ComponentFixture<FhirEditValuesetIncludeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditValuesetIncludeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditValuesetIncludeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
