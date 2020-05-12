import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExportOptions } from '../../shared/export.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'trifolia-fhir-ig-publisher-selection',
  templateUrl: './ig-publisher-selection.component.html',
  styleUrls: ['./ig-publisher-selection.component.css']
})
export class IgPublisherSelectionComponent implements OnInit {
  @Input() public options: ExportOptions;

  public publisherVersions : any;
  public recentPublisherVersions : string[] = ['Loading...'];
  public versionDropdown: any;
  public versionTypeahead: string;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get('/api/export/publisher-version')
      .subscribe(data => {
          this.publisherVersions = data;
          this.recentPublisherVersions = this.publisherVersions.splice(0,10);
          this.versionTypeahead = this.recentPublisherVersions[0];
          const version = this.recentPublisherVersions[0].replace(' (Current)', '');
          this.options.version = version;
        },
        error => {
          console.error(error);
        });
  }

  /**
   * this metehod is called when the user types into the typeahead input box for IG Publisher version
   * @param $e
   */
  typeaheadSelectedVersion($e) {
    $e.preventDefault();
    const item = $e.item;
    this.versionTypeahead = item;
    this.versionDropdown = item;
    const version = item.replace(' (Current)', '');
    this.options.version = version;
  }

  /**
   * this method is called when the user selects an item in the IG Publisher top 10 versions drop down
   * @param version
   */
  selectRecentVersion(version){
    this.versionDropdown = version;
    this.versionTypeahead = version;
    this.options.version = version.replace(' (Current)', '');
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.publisherVersions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

}
