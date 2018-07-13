import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetIncludeModalComponent } from './valueset-include-modal.component';

describe('ValuesetIncludeModalComponent', () => {
  let component: ValuesetIncludeModalComponent;
  let fixture: ComponentFixture<ValuesetIncludeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetIncludeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetIncludeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
