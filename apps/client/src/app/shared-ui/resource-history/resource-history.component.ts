import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FhirService} from '../../shared/fhir.service';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {IBundle, IBundleEntry, IDomainResource} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Component({
  selector: 'app-resource-history',
  templateUrl: './resource-history.component.html',
  styleUrls: ['./resource-history.component.css']
})
export class ResourceHistoryComponent implements OnInit {
  @Input() public resource: IDomainResource;
  @Output() public resourceChange = new EventEmitter<any>();
  @Output() public change: EventEmitter<void> = new EventEmitter<void>();

  public historyBundle: IBundle;
  public message: string;
  public leftResource: any;
  public rightResource: any;
  public isLeftResource = false;
  public page = 1;

  constructor(private fhirService: FhirService) {
  }

  public getActionDisplay(entry: IBundleEntry) {
    if (!entry || !entry.request || !entry.request.method) {
      return 'Unknown';
    }

    switch (entry.request.method) {
      case 'POST':
        return 'Create';
      case 'PUT':
        return 'Update';
      case 'DELETE':
        return 'Remove';
      default:
        return entry.request.method;
    }
  }

  public loadHistory(resource1: any, resource2: any, isLeft: boolean) {
    if (!confirm('Loading the history will overwrite any changes you have made to the resource that are not saved. Save to confirm reverting to the selected historical item. Are you sure want to continue?')) {
      return;
    }

    if (isLeft === true) {
      this.leftResource = resource1;
      this.rightResource = resource2;
      this.message = `Done loading version ${this.leftResource.meta.versionId}`;
    } else {
      this.rightResource = resource1;
      this.leftResource = resource2;
      this.message = `Done loading version ${this.rightResource.meta.versionId}`;
    }

    this.resourceChange.emit(resource1);
    this.change.emit();

  }

  public async getHistory() {
    if (this.resource && this.resource.resourceType && this.resource.id) {
      try {
        this.historyBundle = await this.fhirService.getHistory(this.resource.resourceType, this.resource.id, this.page);

        if (this.historyBundle && this.historyBundle.entry && this.historyBundle.entry.length > 0) {
          if (this.leftResource) {
            const foundLeft = this.historyBundle.entry.find(e => e.resource.meta.versionId === this.leftResource.meta.versionId);

            if (foundLeft) {
              this.leftResource = foundLeft.resource;
            }
          }

          if (this.rightResource) {
            const foundRight = this.historyBundle.entry.find(e => e.resource.meta.versionId === this.rightResource.meta.versionId);

            if (foundRight) {
              this.rightResource = foundRight.resource;
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
    if (this.historyBundle && this.historyBundle.entry && this.historyBundle.entry.length > 2) {
      this.leftResource = this.historyBundle.entry[0].resource;
      this.rightResource = this.historyBundle.entry[1].resource;
    }
  }
}
