import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationDefinitionsComponent } from './operation-definitions.component';

describe('OperationDefinitionsComponent', () => {
  let component: OperationDefinitionsComponent;
  let fixture: ComponentFixture<OperationDefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationDefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
