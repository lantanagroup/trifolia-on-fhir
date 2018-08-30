import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeResourceIdModalComponent } from './change-resource-id-modal.component';

describe('ChangeResourceIdModalComponent', () => {
  let component: ChangeResourceIdModalComponent;
  let fixture: ComponentFixture<ChangeResourceIdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeResourceIdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeResourceIdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
