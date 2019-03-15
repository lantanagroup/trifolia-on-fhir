import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeComponent } from './narrative.component';

describe('NarrativeComponent', () => {
  let component: NarrativeComponent;
  let fixture: ComponentFixture<NarrativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NarrativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
