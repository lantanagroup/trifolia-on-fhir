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
import { ConformanceService } from '../../shared/conformance.service';
import { ExamplesService } from '../../shared/examples.service';
import { IConformance, IExample } from '@trifolia-fhir/models';

@Component({
  templateUrl: './other-resources-result.component.html',
  styleUrls: ['./other-resources-result.component.css']
})
export class OtherResourcesResultComponent extends BaseComponent implements OnInit {
  public resource: IConformance|IExample;
  activeSub: 'json/xml' | 'permissions' = 'json/xml';
  message: string;
  data: any;
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
      .pipe(debounceTime(1000))
      .subscribe(() => {
        if (this.resource) {
          this.serializationError = false;
          this.message = null;
          try {
            // deserialize the content back to data
            if (this.activeSub === 'json/xml' && this.selected === 'JSON') {
              this.data = JSON.parse(this.content);
              this.message = 'The content has been updated';
            } else if (this.activeSub === 'json/xml' && this.selected === 'XML') {
              this.data = this.fhirService.deserialize(this.content);
              this.message = 'The content has been updated';
            }
            if (this.isExample) {
              (<IExample>this.resource).content = this.data;
            } else {
              (<IConformance>this.resource).resource = this.data;
            }
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

    this.isExample = this.route.snapshot.url[this.route.snapshot.url.length-2].path.toLowerCase() === 'example';

    if (this.isExample) {
      this.examplesService.get(this.route.snapshot.params.id).subscribe({
        next: (res: IExample) => {
          this.resource = res;
          this.content = JSON.stringify(res.content, null, '\t');
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
        next: (res: IConformance) => {
          this.resource = res;
          this.content = JSON.stringify(res.resource, null, '\t');
          this.validation = this.fhirService.validate((<IConformance>this.resource).resource);
          setTimeout(() => {
            this.message = 'Resource opened.';
          }, 100);
        },
        error: (err) => {
          this.message = 'Error opening resource: ' + getErrorString(err);
        }
      });
    }

  }

  changeType() {
    setTimeout(() => {
      this.data = this.isExample ? (<IExample>this.resource).content : (<IConformance>this.resource).resource;
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

  public save() {

    let request: Observable<IConformance|IExample>;

    if (this.isExample) {
      request = this.examplesService.save(this.resource.id, <IExample>this.resource, this.configService.project?.implementationGuideId);
    } else {
      request = this.conformanceService.save(this.resource.id, <IConformance>this.resource, this.configService.project?.implementationGuideId);
    }

    request.subscribe({
      next: (res: IConformance|IExample) => {
        Object.assign(this.resource, res);
        this.message = `Successfully updated resource!`;
      },
      error: (err) => {
        this.message = getErrorString(err);
      }
    });

  }

  public remove() {
    if (!confirm(`Are you sure you want to delete the ${this.isExample ? 'example' : 'resource'}?`)) {
      return;
    }

    let request: Observable<IConformance|IExample>;

    if (this.isExample) {
      request = this.examplesService.delete(this.resource.id);
    } else {
      request = this.conformanceService.delete(this.resource.id);
    }

    request.subscribe({
      next: (res: IConformance|IExample) => {
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
