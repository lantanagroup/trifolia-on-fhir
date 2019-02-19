import {Component, ComponentFactoryResolver, OnInit, ViewContainerRef} from '@angular/core';
import {ConfigService} from '../services/config.service';
import {CapabilityStatementComponent as STU3CapabilityStatementComponent} from './stu3/capability-statement.component';
import {CapabilityStatementComponent as R4CapabilityStatementComponent} from './r4/capability-statement.component';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../services/file.service';
import {Versions} from 'fhir/fhir';

/**
 * This class is responsible for determining which capability-statement component to render
 * based on the fhirVersion that is supported by the fhir server.
 */
@Component({
    selector: 'app-capability-statement-wrapper',
    template: '<div></div>'
})
export class CapabilityStatementWrapperComponent implements OnInit {

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private route: ActivatedRoute,
        private fileService: FileService,
        private configService: ConfigService) {
        this.versionChanged();
    }

    versionChanged() {
        let componentFactory;
        let version = this.configService.fhirConformanceVersion;
        const id  = this.route.snapshot.paramMap.get('id');

        if (id === 'from-file' && this.fileService.file) {
            version = this.fileService.file.fhirVersion;
        }

        if (ConfigService.identifyRelease(version) === Versions.R4) {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(R4CapabilityStatementComponent);
        } else {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(STU3CapabilityStatementComponent);
        }

        this.viewContainerRef.clear();
        this.viewContainerRef.createComponent(componentFactory);
    }

    ngOnInit() {
        this.configService.fhirServerChanged.subscribe(() => {
            this.versionChanged();
        });
    }
}
