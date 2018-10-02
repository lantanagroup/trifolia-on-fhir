import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationGuideWrapperComponent } from './implementation-guide-wrapper.component';

describe('ImplementationGuideWrapperComponent', () => {
  let component: ImplementationGuideWrapperComponent;
  let fixture: ComponentFixture<ImplementationGuideWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplementationGuideWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationGuideWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
