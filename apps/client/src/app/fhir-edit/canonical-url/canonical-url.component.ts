import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FhirReferenceModalComponent, ResourceSelection} from '../reference-modal/reference-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fhir-canonical-url',
  templateUrl: './canonical-url.component.html',
  styleUrls: ['./canonical-url.component.css']
})
export class FhirCanonicalUrlComponent implements OnInit {
  @Input() property: any;
  @Input() resourceType: string;
  @Input() title? = "";
  @Input() index?: number;

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  constructor(private modal: NgbModal) { }

  public selectCanonical(){
    const modalRef = this.modal.open(FhirReferenceModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.resourceType = this.resourceType;
    modalRef.componentInstance.hideResourceType = true;

    modalRef.result.then((results: ResourceSelection) => {
      this.property = results.fullUrl;
      this.change.emit(this.property);
    });
  }

  public clear(){
    this.property = "";
    this.change.emit(this.property);
  }

  ngOnInit() {
  }

}
