import { Component, Input, OnInit } from '@angular/core';
import type { IDomainResource } from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { FshService } from '../../shared/fsh.service';
import { FSHMessage } from '../../../../../../libs/tof-lib/src/lib/fsh';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fsh-resource',
  templateUrl: './fsh-resource.component.html',
  styleUrls: ['./fsh-resource.component.css']
})
export class FshResourceComponent implements OnInit {
  @Input() resource: IDomainResource;
  fsh: string;
  errors: FSHMessage[];
  warnings: FSHMessage[];
  message: string;
  messageIsError = false;
  loadingFSH = false;
  converting = false;

  constructor(private fshService: FshService, public activeModal: NgbActiveModal) { }

  get filteredErrors() {
    if (!this.errors) {
      return [];
    }

    return this.errors.filter(e => e.message && e.message.indexOf('No definition for the type') < 0);
  }

  test() {
    this.message = null;
    this.messageIsError = false;
    this.converting = true;

    const destResource = this.resource;

    this.fshService.convertFromFSH(this.fsh)
      .then((res) => {
        if (res.fhir && res.fhir.length === 0) {
          this.message = 'FSH could not be converted to a single resource';
          this.messageIsError = true;
        } else if (res.fhir && res.fhir.length > 1) {
          this.message = 'Too many resources returned from FSH converter';
          this.messageIsError = true;
        } else {
          this.message = 'Successfully converted FSH to a JSON resource';
        }

        this.errors = res.errors;
        this.warnings = null;
        this.converting = false;
      })
      .catch((ex) => {
        this.message = `Error converting FSH to JSON: ${ex.message}`;
        this.messageIsError = true;
        this.converting = false;
      });
  }

  update() {
    this.message = null;
    this.messageIsError = false;
    this.converting = true;

    const destResource = this.resource;

    this.fshService.convertFromFSH(this.fsh)
      .then((res) => {
        if (res.fhir && res.fhir.length === 1) {
          Object.assign(destResource, res.fhir[0]);
          this.message = 'Updated resource in UI to reflect FSH';
        } else if (res.fhir) {
          this.message = 'Too many resources returned from FSH converter';
          this.messageIsError = true;
        }

        this.errors = res.errors;
        this.warnings = null;
        this.converting = false;
      })
      .catch((ex) => {
        this.message = `Error converting FSH to JSON: ${ex.message}`;
        this.messageIsError = true;
        this.converting = false;
      });
  }

  async ngOnInit() {
    this.message = null;
    this.messageIsError = false;
    this.loadingFSH = true;

    try {
      const res = await this.fshService.convertToFSH(this.resource);

      if (res.fsh) {
        this.fsh = res.fsh;
        this.errors = res.errors;
        this.warnings = res.warnings;
      }
    } catch (ex) {
      this.message = `Error converting resource to FSH: ${ex.message}`;
      this.messageIsError = true;
    } finally {
      this.loadingFSH = false;
    }
  }
}
