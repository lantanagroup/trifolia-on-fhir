import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePermissionsComponent } from './resource-permissions.component';

describe('ResourcePermissionsComponent', () => {
  let component: ResourcePermissionsComponent;
  let fixture: ComponentFixture<ResourcePermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
