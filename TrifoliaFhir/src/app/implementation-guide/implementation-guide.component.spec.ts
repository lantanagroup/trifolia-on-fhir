import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationGuideComponent } from './implementation-guide.component';

describe('ImplementationGuideComponent', () => {
  let component: ImplementationGuideComponent;
  let fixture: ComponentFixture<ImplementationGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplementationGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
