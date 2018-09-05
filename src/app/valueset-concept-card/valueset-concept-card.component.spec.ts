import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetConceptCardComponent } from './valueset-concept-card.component';

describe('ValuesetConceptCardComponent', () => {
  let component: ValuesetConceptCardComponent;
  let fixture: ComponentFixture<ValuesetConceptCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetConceptCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetConceptCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
