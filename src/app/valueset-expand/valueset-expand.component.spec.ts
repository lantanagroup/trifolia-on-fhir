import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetExpandComponent } from './valueset-expand.component';

describe('ValuesetExpandComponent', () => {
  let component: ValuesetExpandComponent;
  let fixture: ComponentFixture<ValuesetExpandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetExpandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
