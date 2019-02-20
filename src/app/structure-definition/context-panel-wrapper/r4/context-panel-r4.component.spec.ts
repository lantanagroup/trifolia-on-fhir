import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContextPanelR4Component} from './context-panel-r4.component';

describe('ContextPanelR4Component', () => {
    let component: ContextPanelR4Component;
    let fixture: ComponentFixture<ContextPanelR4Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContextPanelR4Component]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContextPanelR4Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
