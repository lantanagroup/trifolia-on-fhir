import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../shared/file.service';
import {ConfigService} from '../shared/config.service';
import {STU3ImplementationGuideComponent} from './stu3/implementation-guide.component';
import {R4ImplementationGuideComponent} from './r4/implementation-guide.component';
import {Versions} from 'fhir/fhir';
import { CanComponentDeactivate } from '../guards/resource.guard';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {IConformance} from '@trifolia-fhir/models';
import {getErrorString} from '@trifolia-fhir/tof-lib';
import {FhirService} from '../shared/fhir.service';
import {R5ImplementationGuideComponent} from './r5/implementation-guide.component';

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

    this.implementationGuideService.getImplementationGuide(id)
    .subscribe({
      next: (conf: IConformance) => {
        this.configService.fhirVersion = conf.fhirVersion;
        this.fhirService.setFhirVersion(conf.fhirVersion).then( () => {
            if (conf.fhirVersion === Versions.R5.toLowerCase()) {
              componentFactory = this.componentFactoryResolver.resolveComponentFactory(R5ImplementationGuideComponent);
            } else if (conf.fhirVersion === Versions.R4.toLowerCase()) {
              componentFactory = this.componentFactoryResolver.resolveComponentFactory(R4ImplementationGuideComponent);
            } else  if (conf.fhirVersion === Versions.STU3.toLowerCase())  {
              componentFactory = this.componentFactoryResolver.resolveComponentFactory(STU3ImplementationGuideComponent);
            }
            else {
              throw new Error(`Unexpected FHIR version: ${conf.fhirVersion}`);
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

  ngOnInit() {
    this.versionChanged();
  }
}
