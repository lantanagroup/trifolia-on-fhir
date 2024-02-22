import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewContainerRef} from '@angular/core';
import {ConfigService} from '../shared/config.service';
import {STU3CapabilityStatementComponent} from './stu3/capability-statement.component';
import {R4CapabilityStatementComponent} from './r4/capability-statement.component';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../shared/file.service';
import {Versions} from 'fhir/fhir';
import {identifyRelease} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {R5CapabilityStatementComponent} from './r5/capability-statement.component';
import {CanComponentDeactivate} from '../guards/resource.guard';
import {STU3ImplementationGuideComponent} from '../implementation-guide-wrapper/stu3/implementation-guide.component';
import {R4ImplementationGuideComponent} from '../implementation-guide-wrapper/r4/implementation-guide.component';

/**
 * This class is responsible for determining which capability-statement component to render
 * based on the fhirVersion that is supported by the fhir server.
 */
@Component({
  selector: 'app-capability-statement-wrapper',
  template: '<div></div>'
})
export class CapabilityStatementWrapperComponent implements OnInit, CanComponentDeactivate {
  capabilityStatementComponent: ComponentRef<R5CapabilityStatementComponent | R4CapabilityStatementComponent | STU3CapabilityStatementComponent>;


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
    let version;
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'from-file' && this.fileService.file) {
      version = this.fileService.file.fhirVersion;
    } else {
      version = this.configService.fhirVersion;
    }

    if (identifyRelease(version) === Versions.R5) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(R5CapabilityStatementComponent);
    } else if (identifyRelease(version) === Versions.R4) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(R4CapabilityStatementComponent);
    } else if (identifyRelease(version) === Versions.STU3) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(STU3CapabilityStatementComponent);
    } else {
      throw new Error(`Unexpected FHIR version ${version}`);
    }

    this.viewContainerRef.clear();
    this.capabilityStatementComponent = this.viewContainerRef.createComponent(componentFactory);
  }

  canDeactivate(){
    return this.capabilityStatementComponent.instance.canDeactivate();
  }

  ngOnInit() {
      this.versionChanged();
  }
}
