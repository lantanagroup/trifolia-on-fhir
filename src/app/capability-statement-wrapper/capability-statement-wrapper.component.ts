import {Component, ComponentFactoryResolver, OnInit, ViewContainerRef} from '@angular/core';
import {ConfigService} from '../services/config.service';
import {CapabilityStatementComponent as STU3CapabilityStatementComponent} from '../stu3/capability-statement/capability-statement.component';
import {CapabilityStatementComponent as R4CapabilityStatementComponent} from '../r4/capability-statement/capability-statement.component';

@Component({
    selector: 'app-capability-statement-wrapper',
    template: '<div></div>'
})
export class CapabilityStatementWrapperComponent implements OnInit {

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private configService: ConfigService) {
        this.onFhirServerChanged();
    }

    onFhirServerChanged() {
        let componentFactory;

        if (this.configService.fhirVersion.major >= 3 && this.configService.fhirVersion.minor >= 4) {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(R4CapabilityStatementComponent);
        } else {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(STU3CapabilityStatementComponent);
        }

        this.viewContainerRef.clear();
        this.viewContainerRef.createComponent(componentFactory);
    }

    ngOnInit() {
        this.configService.fhirServerChanged.subscribe(() => {
            this.onFhirServerChanged();
        });
    }
}
