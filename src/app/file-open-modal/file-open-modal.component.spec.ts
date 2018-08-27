import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOpenModalComponent } from './file-open-modal.component';

describe('FileOpenModalComponent', () => {
  let component: FileOpenModalComponent;
  let fixture: ComponentFixture<FileOpenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOpenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOpenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
