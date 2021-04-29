import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {PackageListItemModel, PackageListModel} from '../../../../../../libs/tof-lib/src/lib/package-list-model';
import {ConfigService} from '../../shared/config.service';
import {identifyRelease} from '../../../../../../libs/tof-lib/src/lib/fhirHelper';

@Component({
  selector: 'trifolia-fhir-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {
  @Input() implementationGuide: IImplementationGuide;
  @Input() defaultPackageId: string;
  @Input() defaultName: string;
  @Input() defaultTitle: string;
  public packageList: PackageListModel;
  public packageListJSON;
  @Output() public change: EventEmitter<void> = new EventEmitter<void>();
  public valueChange = new EventEmitter();

  constructor(private configService: ConfigService) {
    this.change
    .debounceTime(1000)
    .subscribe(() => {
      PackageListModel.setPackageList(this.implementationGuide, this.packageList, identifyRelease(this.configService.fhirConformanceVersion))
      this.packageListJSON = JSON.stringify(this.packageList, null, "\t");
    });

    this.valueChange
      .debounceTime(1000)
      .subscribe(() => {
        this.packageList = JSON.parse(this.packageListJSON);
      });
  }

  initPackageList() {
    this.packageList = new PackageListModel();
    this.packageList['package-id'] = this.defaultPackageId;
    this.packageList.title = this.defaultTitle || this.defaultName;
    this.packageList.list.push({
      version: 'current',
      path: '',
      desc: '',
      fhirversion: '',
      date: '',
      sequence: '',
      status: 'ci-build',
      current: true
    });
    PackageListModel.setPackageList(this.implementationGuide, this.packageList, identifyRelease(this.configService.fhirConformanceVersion));
  }

  remove() {
    PackageListModel.removePackageList(this.implementationGuide);
    this.packageList = null;
  }

  import(file: File) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const json = e.target.result;

      try {
        this.packageList = <PackageListModel> JSON.parse(json);

        if (!this.packageList['package-id'] && !this.packageList.list && !this.packageList.canonical) {
          throw new Error('Not a package-list.json file');
        }

        this.change.emit();
      } catch (ex) {
        alert('The uploaded file does not appear to be a package-list.json');
      }
    };

    reader.readAsText(file);
  }

  addVersion() {
    this.packageList.list.push(new PackageListItemModel());
    this.change.emit();
  }

  removeVersion(index: number) {
    this.packageList.list.splice(index, 1);
    this.change.emit();
  }

  ngOnInit() {
    this.packageList = PackageListModel.getPackageList(this.implementationGuide);
    this.packageListJSON = JSON.stringify(this.packageList, null, "\t");
  }
}
