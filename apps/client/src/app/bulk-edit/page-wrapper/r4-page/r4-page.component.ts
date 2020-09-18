import {Component, Input, OnInit} from '@angular/core';
import {ImplementationGuide, ImplementationGuidePageComponent} from '../../../../../../../libs/tof-lib/src/lib/r4/fhir';

@Component({
  selector: 'trifolia-fhir-r4-page',
  templateUrl: './r4-page.component.html',
  styleUrls: ['./r4-page.component.css']
})
export class R4PageComponent implements OnInit {
  @Input() implementationGuide: ImplementationGuide;
  public pages: ImplementationGuidePageComponent[];

  constructor() { }

  private populatePages(parent?: ImplementationGuidePageComponent) {
    if (!parent) {
      this.pages = [this.implementationGuide.definition.page];
      this.populatePages(this.implementationGuide.definition.page);
    } else if (parent.page) {
      parent.page.forEach(p => {
        this.pages.push(p);
        this.populatePages(p);
      });
    }
  }

  ngOnInit() {
    this.populatePages();
  }
}
