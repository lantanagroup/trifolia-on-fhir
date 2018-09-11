import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FhirMarkdownComponent} from './markdown.component';

describe('FhirMarkdownComponent', () => {
  let component: FhirMarkdownComponent;
  let fixture: ComponentFixture<FhirMarkdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhirMarkdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
