import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MaxCardinalityComponent} from './max-cardinality.component';

describe('MaxCardinalityComponent', () => {
  let component: MaxCardinalityComponent;
  let fixture: ComponentFixture<MaxCardinalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaxCardinalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxCardinalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
