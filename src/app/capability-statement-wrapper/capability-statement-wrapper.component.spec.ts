import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CapabilityStatementWrapperComponent} from './capability-statement-wrapper.component';

describe('CapabilityStatementWrapperComponent', () => {
  let component: CapabilityStatementWrapperComponent;
  let fixture: ComponentFixture<CapabilityStatementWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapabilityStatementWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapabilityStatementWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
