import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetComponent } from './valueset.component';

describe('ValuesetComponent', () => {
  let component: ValuesetComponent;
  let fixture: ComponentFixture<ValuesetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
