import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ElementDefinitionPanelComponent} from './element-definition-panel.component';

describe('ElementDefinitionPanelComponent', () => {
  let component: ElementDefinitionPanelComponent;
  let fixture: ComponentFixture<ElementDefinitionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementDefinitionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementDefinitionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
