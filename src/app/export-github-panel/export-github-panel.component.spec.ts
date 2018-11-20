import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportGithubPanelComponent } from './export-github-panel.component';

describe('ExportGithubPanelComponent', () => {
  let component: ExportGithubPanelComponent;
  let fixture: ComponentFixture<ExportGithubPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportGithubPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportGithubPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
