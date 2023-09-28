import {AfterContentChecked, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {type IDomainResource, getErrorString, Paginated} from '@trifolia-fhir/tof-lib';
import type {IFhirResource, IHistory, INonFhirResource} from '@trifolia-fhir/models';
import {HistoryService} from '../../shared/history.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-resource-history',
  templateUrl: './resource-history.component.html',
  styleUrls: ['./resource-history.component.css']
})
export class ResourceHistoryComponent implements OnInit, AfterContentChecked {
  @Input() public resource: IFhirResource | INonFhirResource;
  @Output() public resourceChange = new EventEmitter<any>();
  @Output() public change: EventEmitter<void> = new EventEmitter<void>();

  public historyBundle: Paginated<IHistory>;
  public message: string;
  public leftResource: any;
  public rightResource: any;
  public isLeftResource = false;
  public page = 1;
  public domainResource: IDomainResource;

  public currentVersion: number;
  public initialized = false;

  constructor(
    private historyService: HistoryService
    ) {
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
          resourceType = "FhirResource";
        }
        else if(this.resource.hasOwnProperty("content")){
          let res =  <INonFhirResource>this.resource;
          this.domainResource = res.content;
          resourceType = "NonFhirResource";
        }


        this.historyBundle = await firstValueFrom(this.historyService.getHistory(resourceType, this.resource.id, this.page));

      } catch (ex) {
        this.message = getErrorString(ex);
      }
    }
  }

  private _leftVersionId: number;
  public get leftVersionId(): number {
    return this._leftVersionId;
  }
  public set leftVersionId(value: number) {
    this._leftVersionId = value;
    this.leftResource = this.getVersion(value);
  }

  private _rightVersionId: number;
  public get rightVersionId(): number {
    return this._rightVersionId;
  }
  public set rightVersionId(value: number) {
    this._rightVersionId = value;
    this.rightResource = this.getVersion(value);
  }

  public getVersion(versionId: number) {
    return this.historyBundle.results.find(e => e.versionId === versionId);
  }


  ngAfterContentChecked(): void {
    if (this.initialized && this.resource.versionId !== this.currentVersion) {
      this.currentVersion = this.resource.versionId;
      this.getHistory();
    }

  }

  async ngOnInit() {
    this.currentVersion = this.resource.versionId;
    await this.getHistory();

    // Default the left and right selection to the two most recent versions
    if (this.historyBundle  && this.historyBundle.results.length > 1) {
      this.leftVersionId = this.historyBundle.results[0]?.versionId;
      this.rightVersionId = this.historyBundle.results[1]?.versionId;
    }

    this.initialized = true;
  }
}
