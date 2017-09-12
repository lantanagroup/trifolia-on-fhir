import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationGuidesComponent } from './implementation-guides.component';

describe('ImplementationGuidesComponent', () => {
  let component: ImplementationGuidesComponent;
  let fixture: ComponentFixture<ImplementationGuidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplementationGuidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
