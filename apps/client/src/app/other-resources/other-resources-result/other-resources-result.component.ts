import { Component, OnInit } from '@angular/core';
import { FhirService } from '../../shared/fhir.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainResource } from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { getErrorString } from '../../../../../../libs/tof-lib/src/lib/helper';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { ChangeResourceIdModalComponent } from '../../modals/change-resource-id-modal/change-resource-id-modal.component';
import { ConfigService } from '../../shared/config.service';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';
import { ValidatorResponse } from 'fhir/validator';
import { BaseComponent } from '../../base.component';
import { AuthService } from '../../shared/auth.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Conformance} from '../../../../../server/src/app/conformance/conformance.schema';
import { ConformanceService } from '../../shared/conformance.service';
import { ExamplesService } from '../../shared/examples.service';
import { IConformance, IExample } from '@trifolia-fhir/models';

@Component({
  templateUrl: './other-resources-result.component.html',
  styleUrls: ['./other-resources-result.component.css']
})
export class OtherResourcesResultComponent extends BaseComponent implements OnInit {
  public conformance: IConformance;
  activeSub: 'json/xml' | 'permissions' = 'json/xml';
  message: string;
  data: IConformance|IExample;
  Globals = Globals;
  content: string;
  contentChanged = new Subject();
  serializationError = false;
  validation: ValidatorResponse;
  selected = 'JSON';
  options: string[] = ['JSON', 'XML'];
  isExample = false;

  constructor(private fhirService: FhirService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              public configService: ConfigService,
              protected authService: AuthService,
              protected conformanceService: ConformanceService,
              protected examplesService: ExamplesService) {

    super(configService, authService);



    this.contentChanged
      .pipe(debounceTime(500))
      .subscribe(() => {
        if (this.data) {
          this.serializationError = false;
          this.message = null;
          try {
            // deserialize the content back to data
            if (this.activeSub === 'json/xml' && this.selected === 'JSON') {
              this.data = JSON.parse(this.content);
              this.message = 'The content has been updated';
            } else if (this.activeSub === 'json/xml' && this.selected === 'XML') {
              //this.data = this.fhirService.deserialize(this.content);
              this.message = 'The content has been updated';
            }
            this.conformance.resource = this.data;
            this.validation = this.fhirService.validate(this.data);

            if (!this.validation.valid) {
              this.message = 'There are validation errors. This resource will still save but please view the validation tab.';
            }

            setTimeout(() => {
              this.message = '';
            }, 3000);
          } catch (ex) {
            this.message = 'The content you have specified is invalid: ' + ex.message;
            //Deactivate save button when true
            this.serializationError = true;
          }
        }
      });
  }

  contentHasChanged(newValue: string) {
    this.content = newValue;
    this.contentChanged.next(this.content);
  }

  ngOnInit() {
    this.message = 'Opening resource';

    // this.fhirService.read(this.route.snapshot.params.type, this.route.snapshot.params.id)
    //   .subscribe((results: DomainResource) => {

    //     this.data = results;
    //     this.content = JSON.stringify(this.data, null, '\t');
    //     this.validation = this.fhirService.validate(this.data);

    //     setTimeout(() => {
    //       this.message = 'Resource opened.';
    //     }, 100);
    //   }, (err) => {
    //     this.message = 'Error opening resource: ' + getErrorString(err);
    //   });

    this.isExample = this.route.snapshot.url[this.route.snapshot.url.length-2].path.toLowerCase() === 'example';

    if (this.isExample) {
      this.examplesService.get(this.route.snapshot.params.id).subscribe({
        next: (res: IExample) => {
          this.data = res;
          this.content = JSON.stringify(res.content, null, '\t');
        },
        error: (err) => {}
      });
    } else {
      this.conformanceService.get(this.route.snapshot.params.id).subscribe({
        next: (res: IConformance) => {
          this.data = res;
          this.content = JSON.stringify(res.resource, null, '\t');
        },
        error: (err) => {}
      });
    }

  }

  changeType() {
    console.log('Changing content type');
    setTimeout(() => {
      switch (this.selected) {
        case 'JSON':
          this.content = JSON.stringify(this.data, null, '\t');
          break;
        case 'XML':
          this.content = this.fhirService.serialize(this.data);
          break;
      }
    }, 500);
  }

  changeSubTab(event: NgbNavChangeEvent) {
    this.activeSub = <any>event.nextId;
  }

  public downloadFile() {

    const type: string = this.selected;
    switch (type) {
      case 'XML':
        const xml = this.fhirService.serialize(this.data);
        const xmlBlob = new Blob([xml], { type: 'application/xml' });
        saveAs(xmlBlob, this.data.id + '.xml');
        break;
      case 'JSON':
        const json = JSON.stringify(this.data, null, '\t');
        const jsonBlob = new Blob([json], { type: 'application/json' });
        saveAs(jsonBlob, this.data.id + '.json');
        break;
    }
  }

  public uploadFile(event: any) {
    const type: string = this.selected;
    const reader = new FileReader();


    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.onload = () => {
        const content = <string>reader.result;
        let resource: DomainResource;

        switch (type) {
          case 'JSON':
            resource = JSON.parse(content);
            break;
          case 'XML':
            resource = this.fhirService.deserialize(content);
            break;
          default:
            throw new Error('Unexpected type specified: ' + type);
        }

        this.contentHasChanged(content);
      };
      reader.readAsText(file);
    }
  }

  public save(resource: IConformance|IExample) {
    // this.fhirService.update(resource.resourceType, resource.id, resource).toPromise()
    //   .then((updated) => {
    //     Object.assign(resource, updated);
    //     this.message = `Successfully updated resource ${resource.resourceType}/${resource.id}!`;
    //   })
    //   .catch((err) => {
    //     this.message = getErrorString(err);
    //   });

  }

  public remove(data) {
    if (!confirm(`Are you sure you want to delete the code system ${data.title || data.name || data.id}`)) {
      return;
    }

    this.fhirService.delete(data.id)
      .subscribe(() => {
        const entry = (this.data.results || []).find((e) => e.id === data.id);
        const index = this.data.results.indexOf(entry);
        this.data.results.splice(index, 1);
      }, (err) => {
        this.configService.handleError(err, 'An error occurred while deleting the code system');
      });
  }


  public changeId(dr: DomainResource) {
    const modalRef = this.modalService.open(ChangeResourceIdModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.resourceType = dr.resourceType;
    modalRef.componentInstance.originalId = dr.id;
    modalRef.result.then((newId) => {
      // Update the resource
      this.data.id = newId;
    });
  }
}
