import {Component, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { Subject } from 'rxjs';
import { PublishingRequestModel } from '../../../../../../libs/tof-lib/src/lib/publishing-request-model';
import { ConfigService } from '../../shared/config.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'trifolia-fhir-publishing-request',
  templateUrl: './publishing-request.component.html',
  styleUrls: ['./publishing-request.component.css']
})
export class PublishingRequestComponent implements OnInit {
  @Input() resource: any;
  @Input() publicationRequest: any;
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

        this.publishingRequestJSON = JSON.stringify(this.publishingRequest, null, '\t');
        this.publicationRequest["content"] =  this.publishingRequest || {};
      });

    this.valueChange
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.publishingRequest = JSON.parse(this.publishingRequestJSON);
        this.publicationRequest["content"] =  this.publishingRequest || {};
      });
  }

  initPublishingRequest() {
    this.publishingRequest = new PublishingRequestModel();
    this.publishingRequest['package-id'] = this.defaultPackageId;
    this.publishingRequest.title = this.defaultTitle || this.defaultName;

    this.publishingRequestJSON = JSON.stringify(this.publishingRequest, null, '\t');
    this.publicationRequest["content"] = this.publishingRequest;
  }

  remove() {
    this.publicationRequest["content"] = null ;
    this.publishingRequest = null ;
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


  ngOnChanges(changes: SimpleChanges) {
    this.publishingRequest = this.publicationRequest?.content;
    this.publishingRequestJSON = JSON.stringify(this.publishingRequest, null, '\t');
  }


  ngOnInit() {
    this.publishingRequest = this.publicationRequest?.content;
    this.publishingRequestJSON = JSON.stringify(this.publishingRequest, null, '\t');
  }

}
