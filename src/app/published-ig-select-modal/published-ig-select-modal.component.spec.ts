import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedIgSelectModalComponent } from './published-ig-select-modal.component';

describe('PublishedIgSelectModalComponent', () => {
  let component: PublishedIgSelectModalComponent;
  let fixture: ComponentFixture<PublishedIgSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedIgSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedIgSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
