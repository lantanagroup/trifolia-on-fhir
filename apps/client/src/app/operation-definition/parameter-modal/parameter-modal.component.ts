import {Component, Input, OnInit} from '@angular/core';
import {Coding, OperationDefinition, ParameterComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../shared/fhir.service';

@Component({
  selector: 'app-operation-definition-parameter-modal',
  templateUrl: './parameter-modal.component.html',
  styleUrls: ['./parameter-modal.component.css']
})
export class ParameterModalComponent implements OnInit {
  @Input() operationDefinition = new OperationDefinition();
  @Input() parameter = new ParameterComponent();

  public allTypeCodes: Coding[] = [];
  public Globals = Globals;

  constructor(
    public activeModal: NgbActiveModal,
    private fhirService: FhirService) {

  }

  public get valueSetChoice(): string {
    if (!this.parameter.binding) {
      return '';
    }

    if (this.parameter.binding.hasOwnProperty('valueSetUri')) {
      return 'Uri';
    } else if (this.parameter.binding.hasOwnProperty('valueSetReference')) {
      return 'Reference';
    }
  }

  public set valueSetChoice(value: string) {
    if (!this.parameter.binding) {
      return;
    }

    if (value === 'Uri' && !this.parameter.binding.hasOwnProperty('valueSetUri')) {
      delete this.parameter.binding.valueSetReference;
      this.parameter.binding.valueSetUri = '';
    } else if (value === 'Reference' && !this.parameter.binding.hasOwnProperty('valueSetReference')) {
      delete this.parameter.binding.valueSetUri;
      this.parameter.binding.valueSetReference = {reference: '', display: ''};
    }
  }

  ngOnInit() {
    this.allTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/all-types');
  }
}
