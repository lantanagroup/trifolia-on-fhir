import {Component, Input, OnInit} from '@angular/core';
import {
  ElementDefinition as STU3ElementDefinition,
  ElementDefinitionBindingComponent,
  ValueSet
} from '../../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  ElementDefinition as R4ElementDefinition,
  ElementDefinitionElementDefinitionBindingComponent
} from '../../../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../../../libs/tof-lib/src/lib/globals';
import {ConfigService} from '../../../shared/config.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirReferenceModalComponent} from '../../../fhir-edit/reference-modal/reference-modal.component';

@Component({
  selector: 'app-element-definition-binding',
  templateUrl: './binding-panel.component.html',
  styleUrls: ['./binding-panel.component.css']
})
export class BindingPanelComponent implements OnInit {
  @Input() element: STU3ElementDefinition | R4ElementDefinition;
  public Globals = Globals;
  public valueSetChoices = ['Uri', 'Reference'];

  public get STU3Element() {
    if (this.configService.isFhirSTU3) {
      return <STU3ElementDefinition>this.element;
    }
  }

  public get R4Element() {
    if (this.configService.isFhirR4) {
      return <R4ElementDefinition>this.element;
    }
  }

  public get R4ValueSet(): string {
    return this.R4Element.binding.valueSet;
  }

  public set R4ValueSet(value: string) {
    if (!value && this.R4ValueSet) {
      delete this.R4Element.binding.valueSet;
    } else if (value) {
      this.R4Element.binding.valueSet = value;
    }
  }

  constructor(public configService: ConfigService,
              private modalService: NgbModal) {
  }

  public getDefaultBinding(): ElementDefinitionBindingComponent | ElementDefinitionElementDefinitionBindingComponent {
    if (this.configService.isFhirSTU3) {
      return new ElementDefinitionBindingComponent({ strength: 'required' });
    } else if (this.configService.isFhirR4) {
      return new ElementDefinitionElementDefinitionBindingComponent({ strength: 'required' });
    }
  }

  public setValueSetChoice(elementBinding: any, choice: string) {
    const foundChoice = Globals.getChoiceProperty(elementBinding, 'valueSet', ['Uri', 'Reference']);

    if (foundChoice !== choice) {
      delete elementBinding['valueSet' + foundChoice];
    }

    switch (choice) {
      case 'Uri':
        elementBinding['valueSetUri'] = '';
        break;
      case 'Reference':
        elementBinding['valueSetReference'] = {
          reference: '',
          display: ''
        };
        break;
    }
  }

  public selectValueSet() {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.resourceType = 'ValueSet';
    modalRef.componentInstance.hideResourceType = true;
    modalRef.result.then((result) => {
      const valueSet: ValueSet = result.resource;
      this.R4Element.binding.valueSet = valueSet.url;
    });
  }

  ngOnInit() {
  }

}
