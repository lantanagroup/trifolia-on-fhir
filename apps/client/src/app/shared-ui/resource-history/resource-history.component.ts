import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {IDomainResource} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {IFhirResource, INonFhirResource} from '@trifolia-fhir/models';
import {HistoryService} from '../../shared/history.service';

@Component({
  selector: 'app-resource-history',
  templateUrl: './resource-history.component.html',
  styleUrls: ['./resource-history.component.css']
})
export class ResourceHistoryComponent implements OnInit {
  @Input() public resource: IFhirResource | INonFhirResource;
  @Output() public resourceChange = new EventEmitter<any>();
  @Output() public change: EventEmitter<void> = new EventEmitter<void>();

  public historyBundle;
  public message: string;
  public leftResource: any;
  public rightResource: any;
  public isLeftResource = false;
  public page = 1;
  public domainResource: IDomainResource;

  constructor(private historyService: HistoryService) {

  }

  public getActionDisplay(entry) {
    if (!entry || !entry.versionId ) {
      return 'Unknown';
    }
    if(entry.versionId == 1){
      return 'Create';
    }
    else{
      return 'Update';
    }
  }


  public loadHistory(resource1: any, resource2: any, isLeft: boolean) {
    if (!confirm('Loading the history will overwrite any changes you have made to the resource that are not saved. Save to confirm reverting to the selected historical item. Are you sure want to continue?')) {
      return;
    }

    if (isLeft === true) {
      this.leftResource = resource1;
      this.rightResource = resource2;
      this.message = `Done loading left resource`;
    } else {
      this.rightResource = resource1;
      this.leftResource = resource2;
      this.message = `Done loading right resource`;
    }

    this.resourceChange.emit(resource1);
    this.domainResource = resource1;
    this.change.emit();

  }

  public async getHistory() {
    if (this.resource  && this.resource.id) {
      let resourceType = "";
      try {
        if(this.resource.hasOwnProperty("resource")){
          let res =  <IFhirResource>this.resource;
          this.domainResource = res.resource;
          resourceType = "fhirResource";
        }
        else if(this.resource.hasOwnProperty("content")){
          let res =  <INonFhirResource>this.resource;
          this.domainResource = res.content;
          resourceType = "nonFhirResource";
        }

        await this.historyService.getHistory(resourceType, this.resource.id, this.page).then((results) =>  {
          this.historyBundle = results;
        }).catch((err) => console.log(err));

        if (this.historyBundle && this.historyBundle && this.historyBundle.results.length > 0) {
          if (this.leftResource) {
            const foundLeft = this.historyBundle.results.find(e => e.versionId === this.leftResource.meta.versionId);

            if (foundLeft) {
              this.leftResource = foundLeft.content;
            }
          }

          if (this.rightResource) {
            const foundRight = this.historyBundle.results.find(e => e.versionId === this.rightResource.meta.versionId);

            if (foundRight) {
              this.rightResource = foundRight.content;
            }
          }
        }
      } catch (ex) {
        this.message = getErrorString(ex);
      }
    }
  }

  async ngOnInit() {
    await this.getHistory();

    // Default the left and right selection to the two most recent versions
    if (this.historyBundle  && this.historyBundle.results.length > 2) {
      this.leftResource = this.historyBundle.results[0].content;
      this.rightResource = this.historyBundle.results[1].content;
    }
  }
}
