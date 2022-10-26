import { Component, Input, OnInit } from '@angular/core';
import { IDomainResource } from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { FshService } from '../../shared/fsh.service';
import { FSHMessage } from '../../../../../../libs/tof-lib/src/lib/fsh';

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

  constructor(private fshService: FshService) { }

  update() {
    this.message = null;
    this.messageIsError = false;

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
      })
      .catch((ex) => {
        this.message = `Error converting FSH to JSON: ${ex.message}`;
        this.messageIsError = true;
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
