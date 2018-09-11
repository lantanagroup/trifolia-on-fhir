import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirEditAddressModalComponent} from './address-modal.component';

describe('FhirEditAddressModalComponent', () => {
  let component: FhirEditAddressModalComponent;
  let fixture: ComponentFixture<FhirEditAddressModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirEditAddressModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirEditAddressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
