import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-implementation-guide-view',
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
        this.implementationGuideId = this.route.snapshot.paramMap.get('id');
        this.implementationGuideOutputUrl = `/igs/${this.configService.fhirServer}/${this.implementationGuideId}/index.html`;
        this.implementationGuideQAUrl = `/igs/${this.configService.fhirServer}/${this.implementationGuideId}/qa.html`;
    }
}
