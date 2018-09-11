import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PageComponentModalComponent} from './page-component-modal.component';

describe('PageComponentModalComponent', () => {
  let component: PageComponentModalComponent;
  let fixture: ComponentFixture<PageComponentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageComponentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
