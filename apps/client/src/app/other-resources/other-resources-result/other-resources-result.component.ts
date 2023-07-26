import { Component, OnInit } from '@angular/core';
import { FhirService } from '../../shared/fhir.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainResource } from '@trifolia-fhir/stu3';
import { getErrorString } from '@trifolia-fhir/tof-lib';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { ConfigService } from '../../shared/config.service';
import { Globals } from '@trifolia-fhir/tof-lib';
import { ValidatorResponse } from 'fhir/validator';
import { BaseComponent } from '../../base.component';
import { AuthService } from '../../shared/auth.service';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FhirResourceService } from '../../shared/fhir-resource.service';
import { ExamplesService } from '../../shared/examples.service';
import { IFhirResource, IExample, IProjectResource } from '@trifolia-fhir/models';
import { ImplementationGuideService } from '../../shared/implementation-guide.service';

@Component({
  templateUrl: './other-resources-result.component.html',
  styleUrls: ['./other-resources-result.component.css']
})
export class OtherResourcesResultComponent extends BaseComponent implements OnInit {
  public resource: IFhirResource | IExample;
  activeSub: 'json/xml' | 'permissions' = 'json/xml';
  message: string;
  data: any;
  Globals = Globals;
  content: string;
  contentChanged = new Subject();
  serializationError = false;
  validation: ValidatorResponse;
  isFhir = false;
  selected = 'JSON';
  options: string[] = ['JSON', 'XML'];
  isExample = false;

  constructor(private fhirService: FhirService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public configService: ConfigService,
    protected authService: AuthService,
    protected conformanceService: FhirResourceService,
    protected examplesService: ExamplesService,
    protected implementationGuideService: ImplementationGuideService) {

    super(configService, authService);



    this.contentChanged
      .pipe(debounceTime(1000))
      .subscribe(() => {
        if (this.resource) {
          this.serializationError = false;
          this.message = null;

          if (!this.isFhir) {
            this.resource['content'] = this.content;
            return;
          }

          try {
            // deserialize the content back to data
            if (this.activeSub === 'json/xml' && this.selected === 'JSON') {
              this.data = JSON.parse(this.content);
              this.message = 'The content has been updated';
            } else if (this.activeSub === 'json/xml' && this.selected === 'XML') {
              this.data = this.fhirService.deserialize(this.content);
              this.message = 'The content has been updated';
            }
            (<IFhirResource>this.resource).resource = this.data;
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

    this.isFhir = this.route.snapshot.params.type === 'fhir';
    //this.isExample = this.route.snapshot.params.type === 'fhir-example' || this.route.snapshot.params.type === 'nonfhir-example';

    if (!this.isFhir) {
      this.examplesService.get(this.route.snapshot.params.id).subscribe({
        next: (res: IExample) => {
          this.resource = res;
          this.content = res.content;

          if (typeof res.content !== typeof '') {
            this.content = JSON.stringify(res.content, null, '\t');
          }

          try {
            let res = JSON.parse(this.content);
            if (res['resourceType']) {
              this.isFhir = true;
            }
          } catch (error) {
            this.isFhir = false;
          }
          this.validation = this.fhirService.validate((<IExample>this.resource).content);
          setTimeout(() => {
            this.message = 'Example opened.';
          }, 100);
        },
        error: (err) => {
          this.message = 'Error opening example: ' + getErrorString(err);
        }
      });
    } else {
      this.conformanceService.get(this.route.snapshot.params.id).subscribe({
        next: (res: IFhirResource) => {
          this.resource = res;
          this.data = res.resource;
          this.content = JSON.stringify(res.resource, null, '\t');
          this.validation = this.fhirService.validate((<IFhirResource>this.resource).resource);
          this.isFhir = true;
          setTimeout(() => {
            this.message = 'Resource opened.';
          }, 100);
        },
        error: (err) => {
          this.message = 'Error opening resource: ' + getErrorString(err);
        }
      });
    }


    // determine if this resource is referenced as an example in the current IG
    this.isExample = false;
    if (this.configService.project?.implementationGuideId) {
      this.implementationGuideService.getExamples(this.configService.project.implementationGuideId).subscribe({
        next: (res: IProjectResource[]) => {
          if ((res || <IProjectResource[]>[]).findIndex(r => r.id === this.route.snapshot.params.id) > -1) {
            this.isExample = true;
          }
        },
        error: (err) => {
          this.message = 'Error retrieving IG context: ' + getErrorString(err);
        }
      });
    }

  }

  changeType() {
    setTimeout(() => {
      this.data = this.isFhir ? (<IFhirResource>this.resource).resource : (<IExample>this.resource).content;
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

    if (this.data) {
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
    } else {
      const fileName = this.resource['resource'] ? this.resource['resource'].id : this.resource['content']?.id || this.resource.name || 'resource' + '.xml';
      saveAs(new Blob([this.content], { type: 'application/xml' }), fileName);
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

  public save() {

    let request: Observable<IFhirResource | IExample>;

    if (this.isFhir) {
      request = this.conformanceService.save(this.resource.id, <IFhirResource>this.resource, this.configService.project?.implementationGuideId, this.isExample);
    } else {
      request = this.examplesService.save(this.resource.id, <IExample>this.resource, this.configService.project?.implementationGuideId);
    }

    request.subscribe({
      next: (res: IFhirResource | IExample) => {
        Object.assign(this.resource, res);
        this.message = `Successfully updated resource!`;
      },
      error: (err) => {
        this.message = getErrorString(err);
      }
    });

  }

  public remove() {
    if (!confirm(`Are you sure you want to delete this resource?`)) {
      return;
    }

    let request: Observable<IFhirResource | IExample>;

    if (this.isFhir) {
      request = this.conformanceService.delete(this.resource.id);
    } else {
      request = this.examplesService.delete(this.resource.id);
    }

    request.subscribe({
      next: (res: IFhirResource | IExample) => {
        this.router.navigate([`${this.configService.baseSessionUrl}/${this.isExample ? 'examples' : 'other-resources'}`]);
        alert(`Successfully removed resource.`);
      },
      error: (err) => {
        this.message = getErrorString(err);
      }
    });

  }


  public changeId() {
    // const modalRef = this.modalService.open(ChangeResourceIdModalComponent, { backdrop: 'static' });
    // modalRef.componentInstance.resourceType = dr.resourceType;
    // modalRef.componentInstance.originalId = dr.id;
    // modalRef.result.then((newId) => {
    //   // Update the resource
    //   this.data.id = newId;
    // });
  }
}
