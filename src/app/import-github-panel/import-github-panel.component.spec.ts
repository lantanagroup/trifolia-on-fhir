import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGithubPanelComponent } from './import-github-panel.component';

describe('ImportGithubPanelComponent', () => {
  let component: ImportGithubPanelComponent;
  let fixture: ComponentFixture<ImportGithubPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportGithubPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportGithubPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
