import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationDefinitionComponent } from './operation-definition.component';

describe('OperationDefinitionComponent', () => {
  let component: OperationDefinitionComponent;
  let fixture: ComponentFixture<OperationDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
