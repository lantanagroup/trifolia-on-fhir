import {Component, Input, OnInit} from '@angular/core';
import {ImplementationGuide, PageComponent} from '../../../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuidePageComponent} from '../../../../../../../libs/tof-lib/src/lib/r4/fhir';

@Component({
  selector: 'trifolia-fhir-stu3-page',
  templateUrl: './stu3-page.component.html',
  styleUrls: ['./stu3-page.component.css']
})
export class STU3PageComponent implements OnInit {
  @Input() implementationGuide: ImplementationGuide;
  @Input() changedPages: { [fileName: string]: boolean };
  public pages: PageComponent[];
  public expanded: { [fileName: string]: boolean } = {};

  constructor() { }

  public toggleExpandPage(page: ImplementationGuidePageComponent) {
    this.expanded[page.fileName] = !this.expanded[page.fileName];
  }

  private populatePages(parent?: PageComponent) {
    if (!parent) {
      this.pages = [this.implementationGuide.page];
      this.populatePages(this.implementationGuide.page);

      // Ensure all pages have a file name
      if (!this.implementationGuide.page.source) {
        this.implementationGuide.page.setTitle(this.implementationGuide.page.title, true);
        this.changedPages[this.implementationGuide.page.source] = true;
      }
    } else if (parent.page) {
      parent.page.forEach(p => {
        this.pages.push(p);
        this.populatePages(p);

        // Ensure all pages have a file name
        if (!p.source) {
          p.setTitle(p.title);
          this.changedPages[p.source] = true;
        }
      });
    }
  }

  ngOnInit() {
    this.populatePages();
  }
}
