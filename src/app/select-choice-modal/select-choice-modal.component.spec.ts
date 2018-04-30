import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectChoiceModalComponent } from './select-choice-modal.component';

describe('SelectChoiceModalComponent', () => {
  let component: SelectChoiceModalComponent;
  let fixture: ComponentFixture<SelectChoiceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectChoiceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
