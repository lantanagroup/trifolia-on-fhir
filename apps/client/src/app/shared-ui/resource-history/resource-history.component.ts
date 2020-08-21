import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FhirService} from '../../shared/fhir.service';
import {Bundle, EntryComponent} from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';

@Component({
  selector: 'app-resource-history',
  templateUrl: './resource-history.component.html',
  styleUrls: ['./resource-history.component.css']
})
export class ResourceHistoryComponent implements OnInit {
  @Input() public resource: any;
  @Output() public resourceChange = new EventEmitter<any>();
  @Output() public change: EventEmitter<void> = new EventEmitter<void>();

  public historyBundle: Bundle;
  public message: string;
  public compareResource: any;

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

  ngOnInit() {
    if (this.resource && this.resource.resourceType && this.resource.id) {
      this.fhirService.history(this.resource.resourceType, this.resource.id)
        .subscribe((bundle: Bundle) => {
          this.historyBundle = bundle;
        }, (err) => {
          this.message = getErrorString(err);
        });
    }
  }
}
