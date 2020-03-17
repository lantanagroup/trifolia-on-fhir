import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {ResourceReference} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirReferenceModalComponent, ResourceSelection} from '../reference-modal/reference-modal.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-fhir-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class FhirReferenceComponent implements OnInit {
  @Input() public isCanonical = false;
  @Input() public parentObject: any;
  @Input() public propertyName: string;
  @Input() public isFormGroup = true;
  @Input() public title: string;
  @Input() public resourceType?: string;
  @Input() public required: boolean;
  @Input() public hideResourceType?: boolean;
  @Input() public disabled: boolean;
  @Input() public hideDisplay = false;
  @Input() public prependIconClass: string;
  @Input() public prependIconTooltip: string;

  @Output() public change = new EventEmitter<any>();
  private changeDebouncer = new Subject();

  public Globals = Globals;

  constructor(
    private modalService: NgbModal) {

    this.changeDebouncer
      .debounceTime(100)
      .subscribe((v) => this.change.emit(v));
  }

  get reference(): string {
    if (this.isCanonical) return '';

    if (this.parentObject[this.propertyName]) {
      return this.parentObject[this.propertyName].reference;
    }
    return '';
  }

  set reference(value: string) {
    if (this.isCanonical) return;

    if (value && !this.parentObject[this.propertyName]) {
      this.parentObject[this.propertyName] = {};
    }

    if (!value && !this.parentObject[this.propertyName].display) {
      delete this.parentObject[this.propertyName];
      this.changeDebouncer.next(undefined);
    } else if (value) {
      this.parentObject[this.propertyName].reference = value;
      this.changeDebouncer.next(this.parentObject[this.propertyName]);
    }
  }

  get display(): string {
    if (this.isCanonical) return '';

    if (this.parentObject[this.propertyName]) {
      return this.parentObject[this.propertyName].display;
    }
    return '';
  }

  set display(value: string) {
    if (this.isCanonical) return;

    if (value && !this.parentObject[this.propertyName]) {
      this.parentObject[this.propertyName] = {};
    }

    if (!value && !this.parentObject[this.propertyName].reference) {
      delete this.parentObject[this.propertyName];
      this.changeDebouncer.next(undefined);
    } else if (value) {
      this.parentObject[this.propertyName].display = value;
      this.changeDebouncer.next(this.parentObject[this.propertyName]);
    }
  }

  selectReference() {
    const modalRef = this.modalService.open(FhirReferenceModalComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.resourceType = this.resourceType;
    modalRef.componentInstance.hideResourceType = this.hideResourceType;

    modalRef.result.then((results: ResourceSelection) => {
      if (!this.isCanonical) {
        this.reference = `${results.resourceType}/${results.id}`;
        this.display = results.display;
      } else {
        this.parentObject[this.propertyName] = results.resource.url || results.fullUrl;
      }

      this.changeDebouncer.next(this.parentObject[this.propertyName]);
    });
  }

  clear() {
    delete this.parentObject[this.propertyName];
  }

  ngOnInit() {
  }
}
