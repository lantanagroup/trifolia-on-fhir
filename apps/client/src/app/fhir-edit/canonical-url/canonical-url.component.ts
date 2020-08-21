import {Component, Input, OnInit} from '@angular/core';
import {FhirReferenceModalComponent, ResourceSelection} from '../reference-modal/reference-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fhir-canonical-url',
  templateUrl: './canonical-url.component.html',
  styleUrls: ['./canonical-url.component.css']
})
export class FhirCanonicalUrlComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() resourceType: string;
  @Input() title? = "";
  @Input() index?: number;

  constructor(private modal: NgbModal) { }

  public selectCanonical(){
    const modalRef = this.modal.open(FhirReferenceModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.resourceType = this.resourceType;
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((results: ResourceSelection) => {
      if(this.index !== undefined){
        this.parentObject[this.propertyName][this.index] = results.fullUrl;
      }else{
        this.parentObject[this.propertyName] = results.fullUrl;
      }
    });
  }

  public clear(){
    if(this.index !== undefined){
      this.parentObject[this.propertyName][this.index] = "";
    }else{
      this.parentObject[this.propertyName] = "";
    }
  }

  ngOnInit() {
  }

}
