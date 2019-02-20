import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHistoryComponent } from './resource-history.component';

describe('ResourceHistoryComponent', () => {
  let component: ResourceHistoryComponent;
  let fixture: ComponentFixture<ResourceHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
