import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IdentifierModalComponent} from './identifier-modal.component';

describe('IdentifierModalComponent', () => {
  let component: IdentifierModalComponent;
  let fixture: ComponentFixture<IdentifierModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifierModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
