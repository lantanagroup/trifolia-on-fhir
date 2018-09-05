import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipIconComponent } from './tooltip-icon.component';

describe('TooltipIconComponent', () => {
  let component: TooltipIconComponent;
  let fixture: ComponentFixture<TooltipIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
