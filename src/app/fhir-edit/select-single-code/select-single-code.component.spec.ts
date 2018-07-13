import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSingleCodeComponent } from './select-single-code.component';

describe('SelectSingleCodeComponent', () => {
  let component: SelectSingleCodeComponent;
  let fixture: ComponentFixture<SelectSingleCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSingleCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSingleCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
