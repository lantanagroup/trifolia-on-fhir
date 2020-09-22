import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {Identifier} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirIdentifierModalComponent} from '../identifier-modal/identifier-modal.component';
import {FhirService} from '../../shared/fhir.service';

@Component({
  selector: 'app-fhir-multi-identifier',
  templateUrl: './multi-identifier.component.html',
  styleUrls: ['./multi-identifier.component.css']
})
export class FhirMultiIdentifierComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  public tooltip: string;
  public Globals = Globals;

  constructor(private modalService: NgbModal,
              private fhirService: FhirService) {

  }

  public editIdentifier(identifier: Identifier) {
    const ref = this.modalService.open(FhirIdentifierModalComponent, {size: 'lg', backdrop: 'static'});
    ref.componentInstance.identifier = identifier;
    ref.result.then(() => {
        this.change.emit();
    });
  }

  ngOnInit() {
    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    }
  }
}
