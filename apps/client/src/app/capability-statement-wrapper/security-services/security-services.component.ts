import {Component, Input, OnInit} from '@angular/core';
import {ICapabilityStatementSecurityComponent, ICodeableConcept} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirCodeableConceptModalComponent} from '../../fhir-edit/codeable-concept-modal/codeable-concept-modal.component';

@Component({
  selector: 'trifolia-fhir-security-services',
  templateUrl: './security-services.component.html',
  styleUrls: ['./security-services.component.css']
})
export class SecurityServicesComponent implements OnInit {
  @Input() security: ICapabilityStatementSecurityComponent;

  readonly RestfulSecurityServiceSystem = 'http://terminology.hl7.org/CodeSystem/restful-security-service';

  constructor(private modal: NgbModal) { }

  getServiceText(service: ICodeableConcept) {
    if (service.coding && service.coding.length > 0 && service.coding[0].system === this.RestfulSecurityServiceSystem) {
      return service.coding[0].code;
    }
    return 'Other';
  }

  setServiceText(service: ICodeableConcept, value: string) {
    service.coding = service.coding || [];

    if (value !== 'Other') {

      if (service.coding.length <= 0) {
        service.coding.push({
          system: this.RestfulSecurityServiceSystem,
          code: value
        });
      } else {
        service.coding[0].system = this.RestfulSecurityServiceSystem;
        service.coding[0].code = value;
      }
    } else {
      delete service.coding;
      delete service.text;
    }
  }

  editService(service: ICodeableConcept) {
    const modalRef = this.modal.open(FhirCodeableConceptModalComponent, { size: 'lg' });
    modalRef.componentInstance.codeableConcept = service;
  }

  addService() {
    this.security.service = this.security.service || [];
    this.security.service.push({
      coding: [{
        system: this.RestfulSecurityServiceSystem,
        code: 'OAuth'
      }],
      text: 'OAuth'
    });
  }

  ngOnInit() {
  }
}
