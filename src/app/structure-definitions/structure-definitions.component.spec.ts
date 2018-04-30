import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureDefinitionsComponent } from './structure-definitions.component';

describe('StructureDefinitionsComponent', () => {
  let component: StructureDefinitionsComponent;
  let fixture: ComponentFixture<StructureDefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureDefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
