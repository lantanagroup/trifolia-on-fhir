import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesystemComponent } from './codesystem.component';

describe('CodesystemComponent', () => {
  let component: CodesystemComponent;
  let fixture: ComponentFixture<CodesystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodesystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
