import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawResourceComponent } from './raw-resource.component';

describe('RawResourceComponent', () => {
  let component: RawResourceComponent;
  let fixture: ComponentFixture<RawResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
