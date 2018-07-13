import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiIdentifierComponent } from './multi-identifier.component';

describe('MultiIdentifierComponent', () => {
  let component: MultiIdentifierComponent;
  let fixture: ComponentFixture<MultiIdentifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiIdentifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
