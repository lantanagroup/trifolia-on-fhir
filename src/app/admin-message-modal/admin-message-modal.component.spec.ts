import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessageModalComponent } from './admin-message-modal.component';

describe('AdminMessageModalComponent', () => {
  let component: AdminMessageModalComponent;
  let fixture: ComponentFixture<AdminMessageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMessageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMessageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
