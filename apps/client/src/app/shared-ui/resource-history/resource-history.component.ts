import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FhirService} from '../../shared/fhir.service';
import {Bundle, EntryComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {IBundle, IDomainResource} from "../../../../../../libs/tof-lib/src/lib/fhirInterfaces";

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
  public compareResource: any;
  public page = 1;

  constructor(private fhirService: FhirService) {
  }

  public getActionDisplay(entry: EntryComponent) {
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

  public loadHistory(resource: any) {
    if (!confirm('Loading the history will overwrite any changes you have made to the resource that are not saved. Save to confirm reverting to the selected historical item. Are you sure want to continue?')) {
      return;
    }

    this.compareResource = null;
    this.resourceChange.emit(resource);
    this.change.emit();
    this.message = `Done loading version ${this.compareResource.meta.versionId}`;
  }

  public async getHistory() {
    if (this.resource && this.resource.resourceType && this.resource.id) {
      try {
        this.historyBundle = await this.fhirService.getHistory(this.resource.resourceType, this.resource.id, this.page);
      } catch (ex) {
        this.message = getErrorString(ex);
      }
    }
  }

  async ngOnInit() {
    await this.getHistory();
  }
}
