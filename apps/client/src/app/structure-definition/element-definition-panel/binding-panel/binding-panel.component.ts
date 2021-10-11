import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementDefinition as STU3ElementDefinition, ElementDefinitionBindingComponent, ValueSet } from '../../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { ElementDefinition as R4ElementDefinition, ElementDefinitionElementDefinitionBindingComponent } from '../../../../../../../libs/tof-lib/src/lib/r4/fhir';
import { Globals } from '../../../../../../../libs/tof-lib/src/lib/globals';
import { ConfigService } from '../../../shared/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FhirReferenceModalComponent } from '../../../fhir-edit/reference-modal/reference-modal.component';
import { IBundle, IElementDefinition, IValueSet } from '../../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ValueSetService } from '../../../shared/value-set.service';

@Component({
  selector: 'app-element-definition-binding',
  templateUrl: './binding-panel.component.html',
  styleUrls: ['./binding-panel.component.css']
})
export class BindingPanelComponent implements OnInit {
  @Input() element: IElementDefinition;
  public Globals = Globals;
  public valueSetChoices = ['Uri', 'Reference'];
  public selectedValueSet: IValueSet;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

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
              private modalService: NgbModal,
              private valueSetService: ValueSetService) {
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

  public openSelectValueSet() {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resourceType = 'ValueSet';
    modalRef.componentInstance.hideResourceType = true;
    modalRef.result.then((result) => {
      const valueSet: IValueSet = result.resource;
      this.selectValueSet(valueSet);
    });
  }

  public selectValueSet(valueSet: IValueSet) {
    this.selectedValueSet = valueSet;

    if (this.configService.isFhirR4) {
      this.R4Element.binding.valueSet = valueSet.url;
    } else if (this.configService.isFhirSTU3) {
      if (this.STU3Element.binding.hasOwnProperty('valueSetUri')) {
        this.STU3Element.binding.valueSetUri = valueSet.url;
      } else if (this.STU3Element.binding.hasOwnProperty('valueSetReference')) {
        this.STU3Element.binding.valueSetReference = {
          reference: 'ValueSet/' + valueSet.id
        };
      }
    }

    this.change.emit();
  }

  public getValueSetText(valueSet: IValueSet): string {
    return valueSet.url;
  }

  public search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length <= 2) return [];
        return this.valueSetService.search(1, term).pipe(
          map((bundle: IBundle) => (bundle.entry || []).map(entry => <IValueSet>entry.resource))
        );
      })
    );
  };

  ngOnInit() {
    if (this.configService.isFhirR4) {
      if (this.R4Element && this.R4Element.binding && this.R4Element.binding.valueSet) {
        this.selectedValueSet = {
          resourceType: 'ValueSet',
          url: this.R4Element.binding.valueSet
        };
      }
    }
  }
}
