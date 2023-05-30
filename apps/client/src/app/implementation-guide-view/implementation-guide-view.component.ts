import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConfigService} from '../shared/config.service';

@Component({
  templateUrl: './implementation-guide-view.component.html',
  styleUrls: ['./implementation-guide-view.component.css']
})
export class ImplementationGuideViewComponent implements OnInit {
  public implementationGuideId: string;
  public implementationGuideOutputUrl: string;
  public implementationGuideQAUrl: string;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.implementationGuideId = this.route.snapshot.paramMap.get('implementationGuideId');
    this.implementationGuideOutputUrl = `/igs/${this.implementationGuideId}/index.html`;
    this.implementationGuideQAUrl = `/igs/${this.implementationGuideId}/qa.html`;
  }
}
