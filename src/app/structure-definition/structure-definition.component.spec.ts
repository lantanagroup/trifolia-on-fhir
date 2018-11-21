import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureDefinitionComponent } from './structure-definition.component';

describe('StructureDefinitionComponent', () => {
  let component: StructureDefinitionComponent;
  let fixture: ComponentFixture<StructureDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
