import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetsComponent } from './valuesets.component';

describe('ValuesetsComponent', () => {
  let component: ValuesetsComponent;
  let fixture: ComponentFixture<ValuesetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
