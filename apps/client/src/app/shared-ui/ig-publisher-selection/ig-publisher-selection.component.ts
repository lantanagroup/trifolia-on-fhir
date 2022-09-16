import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExportOptions } from '../../shared/export.service';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

interface PublisherVersion {
  id: string;
  name: string;
}

@Component({
  selector: 'trifolia-fhir-ig-publisher-selection',
  templateUrl: './ig-publisher-selection.component.html',
  styleUrls: ['./ig-publisher-selection.component.css']
})
export class IgPublisherSelectionComponent implements OnInit {
  @Input() public options: ExportOptions;

  public versions: PublisherVersion[];
  public versionTypeahead: string;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get('/api/export/publisher-version')
      .subscribe((data: PublisherVersion[]) => {
          this.versions = data;
          this.versionTypeahead = this.versions[0].name;
          this.options.version = this.versions[0].id;
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
    const item: PublisherVersion = $e.item;
    this.versionTypeahead = item.name;
    this.options.version = item.id;
  }

  /**
   * this method is called when the user selects an item in the IG Publisher top 10 versions drop down
   * @param version
   */
  selectRecentVersion(version: PublisherVersion){
    this.versionTypeahead = version.name;
    this.options.version = version.id;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term: string) => term.length < 2 ? []
        : this.versions.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

}
