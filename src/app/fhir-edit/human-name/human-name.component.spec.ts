import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanNameComponent } from './human-name.component';

describe('HumanNameComponent', () => {
  let component: HumanNameComponent;
  let fixture: ComponentFixture<HumanNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
