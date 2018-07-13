import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiJurisdictionComponent } from './multi-jurisdiction.component';

describe('MultiJurisdictionComponent', () => {
  let component: MultiJurisdictionComponent;
  let fixture: ComponentFixture<MultiJurisdictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiJurisdictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiJurisdictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
