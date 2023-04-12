import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../shared/file.service';
import {ConfigService} from '../shared/config.service';
import {STU3ImplementationGuideComponent} from './stu3/implementation-guide.component';
import {R4ImplementationGuideComponent} from './r4/implementation-guide.component';
import {Versions} from 'fhir/fhir';
import {identifyRelease} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import { CanComponentDeactivate } from '../guards/resource.guard';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {IConformance, IProjectResourceReferenceMap} from '@trifolia-fhir/models';
import {ImplementationGuide} from '@trifolia-fhir/r4';
import {getErrorString} from '@trifolia-fhir/tof-lib';
import {FhirService} from '../shared/fhir.service';

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
  private igNotFound: boolean;
  private message: string;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private fileService: FileService,
    private configService: ConfigService,
    private fhirService: FhirService,
    private implementationGuideService: ImplementationGuideService) {
    this.versionChanged();
  }

  canDeactivate(){
    return this.igComponent.instance.canDeactivate();
  }

  versionChanged() {
    let componentFactory: any;
    let version = "";
    const id = this.route.snapshot.paramMap.get('implementationGuideId');
    if (id === 'from-file' && this.fileService.file) {
      version = this.fileService.file.fhirVersion;
    }

    let ig;
    // get Ig version
    this.implementationGuideService.getImplementationGuide(id)
    .subscribe({
      next: (results) => {
        const conf: IConformance = results;
        this.configService.fhirVersion = conf.fhirVersion;
        this.fhirService.setFhirVersion(conf.fhirVersion).then( () => {
            if (conf.fhirVersion === Versions.R4.toLowerCase()) {
              componentFactory = this.componentFactoryResolver.resolveComponentFactory(R4ImplementationGuideComponent);
            } else {
              componentFactory = this.componentFactoryResolver.resolveComponentFactory(STU3ImplementationGuideComponent);
            }
            this.viewContainerRef.clear();
            this.igComponent = this.viewContainerRef.createComponent(componentFactory);
          }
        );
      },
      error: (err) => {
        this.igNotFound = err.status === 404;
        this.message = getErrorString(err);
      }
    });

  }

  ngOnInit() {// this.configService.fhirServerChanged.subscribe(() => {
      this.versionChanged();
  }
}
