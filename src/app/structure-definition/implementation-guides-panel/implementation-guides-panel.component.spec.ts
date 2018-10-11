import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationGuidesPanelComponent } from './implementation-guides-panel.component';

describe('ImplementationGuidesPanelComponent', () => {
  let component: ImplementationGuidesPanelComponent;
  let fixture: ComponentFixture<ImplementationGuidesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplementationGuidesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationGuidesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
