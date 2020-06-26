import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../shared/file.service';
import {ConfigService} from '../shared/config.service';
import {STU3ImplementationGuideComponent} from './stu3/implementation-guide.component';
import {R4ImplementationGuideComponent} from './r4/implementation-guide.component';
import {Versions} from 'fhir/fhir';
import { CanComponentDeactivate } from '../guards/resource.guard';

/**
 * This class is responsible for determining which implementation-guide component to render
 * based on the fhirVersion that is supported by the fhir server.
 */
@Component({
  selector: 'app-implementation-guide-wrapper',
  template: '<div></div>'
})
export class ImplementationGuideWrapperComponent implements OnInit, CanComponentDeactivate {
  igComponent: ComponentRef<STU3ImplementationGuideComponent | R4ImplementationGuideComponent>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private fileService: FileService,
    private configService: ConfigService) {
    this.versionChanged();
  }

  canDeactivate(){
    return this.igComponent.instance.canDeactivate();
  }

  versionChanged() {
    let componentFactory;
    let version = this.configService.fhirConformanceVersion;
    const id = this.route.snapshot.paramMap.get('id');

    if (id === 'from-file' && this.fileService.file) {
      version = this.fileService.file.fhirVersion;
    }

    if (ConfigService.identifyRelease(version) === Versions.R4) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(R4ImplementationGuideComponent);
    } else {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(STU3ImplementationGuideComponent);
    }

    this.viewContainerRef.clear();
    this.igComponent = this.viewContainerRef.createComponent(componentFactory);
  }

  ngOnInit() {
    this.configService.fhirServerChanged.subscribe(() => {
      this.versionChanged();
    });
  }
}
