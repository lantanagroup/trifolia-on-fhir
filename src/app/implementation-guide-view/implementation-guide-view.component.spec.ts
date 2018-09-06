import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationGuideViewComponent } from './implementation-guide-view.component';

describe('ImplementationguideViewComponent', () => {
  let component: ImplementationGuideViewComponent;
  let fixture: ComponentFixture<ImplementationGuideViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplementationGuideViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationGuideViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
