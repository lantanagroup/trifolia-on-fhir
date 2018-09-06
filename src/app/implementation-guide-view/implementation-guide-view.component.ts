import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

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
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.implementationGuideId = this.route.snapshot.paramMap.get('id');
        this.implementationGuideOutputUrl = '/igs/' + this.implementationGuideId + '/index.html';
        this.implementationGuideQAUrl = '/igs/' + this.implementationGuideId + '/qa.html';
    }
}
