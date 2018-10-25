import {Component, Input, OnInit} from '@angular/core';
import {
    StructureDefinitionImplementationnGuide,
    StructureDefinitionOptions
} from '../../services/structure-definition.service';
import {ImplementationGuideService} from '../../services/implementation-guide.service';
import {ImplementationGuideListItemModel} from '../../models/implementation-guide-list-item-model';
import {ConfigService} from '../../services/config.service';
import * as _ from 'underscore';
import {Bundle, ImplementationGuide} from '../../models/stu3/fhir';

@Component({
    selector: 'app-implementation-guides-panel',
    templateUrl: './implementation-guides-panel.component.html',
    styleUrls: ['./implementation-guides-panel.component.css']
})
export class ImplementationGuidesPanelComponent implements OnInit {
    @Input() options = new StructureDefinitionOptions();
    public implementationGuidesBundle: Bundle;
    public newImplementationGuide: StructureDefinitionImplementationnGuide;

    constructor(
        private implementationGuideService: ImplementationGuideService,
        private configService: ConfigService) {
    }

    public get implementationGuides() {
        if (!this.implementationGuidesBundle) {
            return [];
        }

        return _.map(this.implementationGuidesBundle.entry, (entry) => <ImplementationGuide> entry.resource);
    }

    public addImplementationGuide() {
        this.newImplementationGuide = new StructureDefinitionImplementationnGuide();
        this.newImplementationGuide.isNew = true;
    }

    public doneAdding() {
        this.options.implementationGuides.push(this.newImplementationGuide);
        this.newImplementationGuide = null;
    }

    public removeImplementationGuide(ig: StructureDefinitionImplementationnGuide) {
        if (ig.isNew) {
            const index = this.options.implementationGuides.indexOf(ig);
            this.options.implementationGuides.splice(index, 1);
        } else {
            ig.isRemoved = true;
        }
    }

    public getUnusedImplementationGuides() {
        return _.filter(this.implementationGuides, (implementationGuide) => {
            return !_.find(this.options.implementationGuides, (next) => next.id === implementationGuide.id);
        });
    }

    public setNewImplementationGuide(id: string) {
        const foundImplementationGuide = _.find(this.implementationGuides, (implementationGuide) => implementationGuide.id === id);

        if (foundImplementationGuide) {
            this.newImplementationGuide.id = foundImplementationGuide.id;
            this.newImplementationGuide.name = foundImplementationGuide.name;
        }
    }

    ngOnInit() {
        this.implementationGuideService.getImplementationGuides()
            .subscribe((results) => {
                this.implementationGuidesBundle = results;
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while retrieving implementation guides');
            });
    }
}
