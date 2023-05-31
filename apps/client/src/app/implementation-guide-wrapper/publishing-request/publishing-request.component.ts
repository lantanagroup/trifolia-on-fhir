import { Component, Input, OnInit, Output } from '@angular/core';
import { IImplementationGuide } from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { Subject } from 'rxjs';
import { PublishingRequestModel } from '../../../../../../libs/tof-lib/src/lib/publishing-request-model';
import { ConfigService } from '../../shared/config.service';
import { debounceTime } from 'rxjs/operators';
import { identifyRelease } from '../../../../../../libs/tof-lib/src/lib/fhirHelper';

@Component({
  selector: 'trifolia-fhir-publishing-request',
  templateUrl: './publishing-request.component.html',
  styleUrls: ['./publishing-request.component.css']
})
export class PublishingRequestComponent implements OnInit {
  @Input() implementationGuide: IImplementationGuide;
  @Input() defaultPackageId: string;
  @Input() defaultName: string;
  @Input() defaultTitle: string;
  public publishingRequest: PublishingRequestModel;
  public publishingRequestJSON;
  @Output() public change = new Subject();
  public valueChange = new Subject();

  constructor(private configService: ConfigService) {
    this.change
      .pipe(debounceTime(1000))
      .subscribe(() => {
        PublishingRequestModel.setPublishingRequest(this.implementationGuide, this.publishingRequest, identifyRelease(this.configService.fhirVersion));
        this.publishingRequestJSON = JSON.stringify(this.publishingRequest, null, '\t');
      });

    this.valueChange
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.publishingRequest = JSON.parse(this.publishingRequestJSON);
      });
  }

  initPublishingRequest() {
    this.publishingRequest = new PublishingRequestModel();
    this.publishingRequest['package-id'] = this.defaultPackageId;
    this.publishingRequest.title = this.defaultTitle || this.defaultName;
    PublishingRequestModel.setPublishingRequest(this.implementationGuide, this.publishingRequest, identifyRelease(this.configService.fhirVersion));
  }

  remove() {
    PublishingRequestModel.removePublishingRequest(this.implementationGuide);
    this.publishingRequest = null;
  }

  import(file: File) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const json = e.target.result;

      try {
        this.publishingRequest = <PublishingRequestModel>JSON.parse(json);

        if (!this.publishingRequest['package-id']) {
          throw new Error('Not a publication-request.json file');
        }

        this.change.next(null);
      } catch (ex) {
        alert('The uploaded file does not appear to be a publication-request.json');
      }
    };

    reader.readAsText(file);
  }


  ngOnInit() {
    this.publishingRequest = PublishingRequestModel.getPublishingRequest(this.implementationGuide);
    this.publishingRequestJSON = JSON.stringify(this.publishingRequest, null, '\t');

    /*if(this.publishingRequest.sequence.length === 0) {
      this.publishingRequest.sequence = "Releases";
    }*/
  }

}
