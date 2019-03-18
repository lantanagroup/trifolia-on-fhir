import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncludePanelComponent } from './include-panel.component';

describe('IncludePanelComponent', () => {
  let component: IncludePanelComponent;
  let fixture: ComponentFixture<IncludePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncludePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncludePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
