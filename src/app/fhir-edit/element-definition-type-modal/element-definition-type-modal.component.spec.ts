import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementDefinitionTypeModalComponent } from './element-definition-type-modal.component';

describe('ElementDefinitionTypeModalComponent', () => {
  let component: ElementDefinitionTypeModalComponent;
  let fixture: ComponentFixture<ElementDefinitionTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementDefinitionTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementDefinitionTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
