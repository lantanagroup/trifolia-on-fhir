import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiContactComponent } from './multi-contact.component';

describe('MultiContactComponent', () => {
  let component: MultiContactComponent;
  let fixture: ComponentFixture<MultiContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
