import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationDefinitionParameterModalComponent } from './operation-definition-parameter-modal.component';

describe('OperationDefinitionParameterModalComponent', () => {
  let component: OperationDefinitionParameterModalComponent;
  let fixture: ComponentFixture<OperationDefinitionParameterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationDefinitionParameterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDefinitionParameterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
