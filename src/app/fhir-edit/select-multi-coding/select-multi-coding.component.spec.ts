import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultiCodingComponent } from './select-multi-coding.component';

describe('SelectMultiCodingComponent', () => {
  let component: SelectMultiCodingComponent;
  let fixture: ComponentFixture<SelectMultiCodingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMultiCodingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMultiCodingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
