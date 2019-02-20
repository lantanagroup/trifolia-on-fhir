import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContextPanelWrapperComponent} from './context-panel-wrapper.component';

describe('ContextPanelWrapperComponent', () => {
    let component: ContextPanelWrapperComponent;
    let fixture: ComponentFixture<ContextPanelWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContextPanelWrapperComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContextPanelWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
