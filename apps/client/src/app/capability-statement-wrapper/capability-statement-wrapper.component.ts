import {Component, ComponentFactoryResolver, OnInit, ViewContainerRef} from '@angular/core';
import {ConfigService} from '../shared/config.service';
import {STU3CapabilityStatementComponent} from './stu3/capability-statement.component';
import {R4CapabilityStatementComponent} from './r4/capability-statement.component';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../shared/file.service';
import {Versions} from 'fhir/fhir';
import {identifyRelease} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {IConformance} from '@trifolia-fhir/models';
import {ImplementationGuide} from '@trifolia-fhir/r4';
import {ImplementationGuideService} from '../shared/implementation-guide.service';

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
    private configService: ConfigService,
    private implementationGuideService: ImplementationGuideService) {
    this.versionChanged();
  }

  versionChanged() {
    let componentFactory;
    let version = this.configService.fhirConformanceVersion;
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
          ig = new ImplementationGuide(conf.resource);
          if(ig.hasOwnProperty ("fhirVersion")){
            version = ig["fhirVersion"][0];
          }
          if (identifyRelease(version) === Versions.R4) {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(R4CapabilityStatementComponent);
          } else {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(STU3CapabilityStatementComponent);
          }
          this.viewContainerRef.clear();
          this.viewContainerRef.createComponent(componentFactory);
         // this.igComponent = this.viewContainerRef.createComponent(componentFactory);
        },
        error: (err) => {
        }
      });

  }

  ngOnInit() {
    //this.configService.fhirServerChanged.subscribe(() => {
      this.versionChanged();
   // });
  }
}
