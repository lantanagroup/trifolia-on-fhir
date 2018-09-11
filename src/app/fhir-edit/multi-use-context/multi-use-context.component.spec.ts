import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MultiUseContextComponent} from './multi-use-context.component';

describe('MultiUseContextComponent', () => {
  let component: MultiUseContextComponent;
  let fixture: ComponentFixture<MultiUseContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiUseContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiUseContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
