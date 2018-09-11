import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CapabilityStatementsComponent} from './capability-statements.component';

describe('CapabilityStatementsComponent', () => {
  let component: CapabilityStatementsComponent;
  let fixture: ComponentFixture<CapabilityStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapabilityStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapabilityStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
