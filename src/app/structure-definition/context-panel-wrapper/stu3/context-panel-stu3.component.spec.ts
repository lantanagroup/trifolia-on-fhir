import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContextPanelStu3Component} from './context-panel-stu3.component';

describe('ContextPanelStu3Component', () => {
    let component: ContextPanelStu3Component;
    let fixture: ComponentFixture<ContextPanelStu3Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContextPanelStu3Component]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContextPanelStu3Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
