import {Component, Input, OnInit} from '@angular/core';
import {ImplementationGuide, ImplementationGuidePageComponent} from '../../../../../../../libs/tof-lib/src/lib/r4/fhir';

@Component({
  selector: 'trifolia-fhir-r4-page',
  templateUrl: './r4-page.component.html',
  styleUrls: ['./r4-page.component.css']
})
export class R4PageComponent implements OnInit {
  @Input() implementationGuide: ImplementationGuide;
  @Input() changedPages: { [fileName: string]: boolean };
  public pages: ImplementationGuidePageComponent[];
  public expanded: { [fileName: string]: boolean } = {};

  constructor() { 
    console.log('R4PageComponent::ctor');
  }

  public toggleExpandPage(page: ImplementationGuidePageComponent) {
    this.expanded[page.fileName] = !this.expanded[page.fileName];
  }

  private populatePages(parent?: ImplementationGuidePageComponent) {
    if (!parent && this.implementationGuide.definition.page) {
      this.pages = [this.implementationGuide.definition.page];
      this.populatePages(this.implementationGuide.definition.page);

      // Ensure all pages have a file name
      if (!this.implementationGuide.definition.page.fileName) {
        this.implementationGuide.definition.page.setTitle(this.implementationGuide.definition.page.title, true);
        this.changedPages[this.implementationGuide.definition.page.fileName] = true;
      }
    } else if (parent && parent.page) {
      parent.page.forEach(p => {
        this.pages.push(p);
        this.populatePages(p);

        // Ensure all pages have a file name
        if (!p.fileName) {
          p.setTitle(p.title);
          this.changedPages[p.fileName] = true;
        }
      });
    }
  }

  ngOnInit() {
    this.populatePages();
  }
}
