import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CodesystemsComponent} from './codesystems.component';

describe('CodesystemsComponent', () => {
  let component: CodesystemsComponent;
  let fixture: ComponentFixture<CodesystemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodesystemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
