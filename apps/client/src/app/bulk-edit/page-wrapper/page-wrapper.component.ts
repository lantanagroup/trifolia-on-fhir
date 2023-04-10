import {Component, ComponentFactoryResolver, ComponentRef, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';
import {STU3PageComponent} from './stu3-page/stu3-page.component';
import {R4PageComponent} from './r4-page/r4-page.component';
import {identifyRelease} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Versions} from 'fhir/fhir';
import {ConfigService} from '../../shared/config.service';
import type {IImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Component({
  selector: 'trifolia-fhir-page-wrapper',
  template: '<div></div>'
})
export class PageWrapperComponent implements OnInit, OnChanges {
  pageComponent: ComponentRef<STU3PageComponent | R4PageComponent>;

  @Input() implementationGuide: IImplementationGuide;
  @Input() changedPages: { [fileName: string]: boolean };

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private configService: ConfigService) {
    this.changed();
  }

  changed(init = true) {
    if (!this.implementationGuide) return;

    if (init || !this.pageComponent) {
      let componentFactory: any;
      const version = this.configService.fhirConformanceVersion;

      if (identifyRelease(this.implementationGuide.fhirVersion[0]) === Versions.R4) {
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(R4PageComponent);
      } else {
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(STU3PageComponent);
      }

      this.viewContainerRef.clear();
      this.pageComponent = this.viewContainerRef.createComponent(componentFactory);
    }

    this.pageComponent.instance.implementationGuide = <any> this.implementationGuide;
    this.pageComponent.instance.changedPages = this.changedPages;
  }

  ngOnInit() {
  //  this.configService.fhirServerChanged.subscribe(() => {
      this.changed(true);
  //  });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changed();
  }
}
