import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherResourcesComponent } from './other-resources.component';

describe('OtherResourcesComponent', () => {
  let component: OtherResourcesComponent;
  let fixture: ComponentFixture<OtherResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
