import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanNamesComponent } from './human-names.component';

describe('HumanNamesComponent', () => {
  let component: HumanNamesComponent;
  let fixture: ComponentFixture<HumanNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
