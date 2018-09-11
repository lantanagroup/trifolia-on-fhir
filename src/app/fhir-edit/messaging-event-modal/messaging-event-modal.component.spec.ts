import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirEditMessagingEventModalComponent} from './messaging-event-modal.component';

describe('FhirEditMessagingEventModalComponent', () => {
  let component: FhirEditMessagingEventModalComponent;
  let fixture: ComponentFixture<FhirEditMessagingEventModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditMessagingEventModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditMessagingEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
