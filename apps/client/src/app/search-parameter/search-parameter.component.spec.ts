import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchParameterComponent } from './search-parameter.component';

describe('SearchParameterComponent', () => {
  let component: SearchParameterComponent;
  let fixture: ComponentFixture<SearchParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchParameterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
