import {
    Component,
    ComponentFactoryResolver, ComponentRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core';
import {ConfigService} from '../../shared/config.service';
import {Versions} from 'fhir/fhir';
import {ActivatedRoute} from '@angular/router';
import {ContextPanelR4Component} from './r4/context-panel-r4.component';
import {ContextPanelStu3Component} from './stu3/context-panel-stu3.component';
import {StructureDefinition as STU3StructureDefinition} from '../../models/stu3/fhir';
import {StructureDefinition as R4StructureDefinition} from '../../models/r4/fhir';

export interface IContextPanelComponent {
    structureDefinition: STU3StructureDefinition | R4StructureDefinition;
}

@Component({
    selector: 'app-structure-definition-context-panel-wrapper',
    template: '<div></div>'
})
export class ContextPanelWrapperComponent implements OnInit, OnChanges {
    @Input()
    public structureDefinition: STU3StructureDefinition | R4StructureDefinition;
    private component: ComponentRef<IContextPanelComponent>;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private route: ActivatedRoute,
        private configService: ConfigService) {
        this.versionChanged();
    }

    versionChanged() {
        let componentFactory;
        const version = this.configService.fhirConformanceVersion;

        if (ConfigService.identifyRelease(version) === Versions.R4) {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextPanelR4Component);
        } else {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextPanelStu3Component);
        }

        this.viewContainerRef.clear();

        this.component = this.viewContainerRef.createComponent<IContextPanelComponent> (componentFactory);
        this.component.instance.structureDefinition = this.structureDefinition;
    }

    ngOnInit() {
        this.configService.fhirServerChanged.subscribe(() => {
            this.versionChanged();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.component.instance.structureDefinition = this.structureDefinition;
    }
}
