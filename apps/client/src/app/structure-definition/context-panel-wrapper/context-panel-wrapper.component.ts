import {
  Component,
  ComponentFactoryResolver, ComponentRef, EventEmitter,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {ConfigService} from '../../shared/config.service';
import {Versions} from 'fhir/fhir';
import {ActivatedRoute} from '@angular/router';
import {ContextPanelR4Component} from './r4/context-panel-r4.component';
import {ContextPanelStu3Component} from './stu3/context-panel-stu3.component';
import {StructureDefinition as STU3StructureDefinition} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {StructureDefinition as R4StructureDefinition} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {identifyRelease} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';

export interface IContextPanelComponent {
  change: EventEmitter<void>;
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
  @Output() change = new EventEmitter<void>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private configService: ConfigService) {
    this.versionChanged();
  }

  versionChanged() {
    let componentFactory;
   // const version = this.configService.fhirVersion;

    if (this.configService.fhirVersion  === Versions.R4.toLowerCase()) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextPanelR4Component);
    } else {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextPanelStu3Component);
    }

    this.viewContainerRef.clear();

    this.component = this.viewContainerRef.createComponent<IContextPanelComponent>(componentFactory);
    this.component.instance.structureDefinition = this.structureDefinition;
  }

  ngOnInit() {
    //this.configService.fhirServerChanged.subscribe(() => {
      this.versionChanged();
   // });
    this.component.instance.change.subscribe(this.change);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.component.instance.structureDefinition = this.structureDefinition;
  }
}
