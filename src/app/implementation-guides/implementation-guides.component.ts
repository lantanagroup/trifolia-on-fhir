import { Component, OnInit } from '@angular/core';
import { ImplementationGuideService } from '../services/implementation-guide.service';
import { ImplementationGuideListItemModel } from '../models/implementation-guide-list-item-model';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-implementation-guides',
    templateUrl: './implementation-guides.component.html',
    styleUrls: ['./implementation-guides.component.css'],
    providers: [ImplementationGuideService]
})
export class ImplementationGuidesComponent implements OnInit {
    public implementationGuides: ImplementationGuideListItemModel[] = [];

    constructor(private igService: ImplementationGuideService, private configService: ConfigService) { }

    private getImplementationGuides() {
        this.implementationGuides = [];
        this.configService.setStatusMessage('Loading implementation guides');

        this.igService.getImplementationGuides(undefined)
            .subscribe(res => {
                this.implementationGuides = res;
                this.configService.setStatusMessage('');
            }, err => {
                this.configService.setStatusMessage('Error loading implementation guides: ' + err);
            });
    }

    ngOnInit() {
        this.getImplementationGuides();
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getImplementationGuides());
    }
}
