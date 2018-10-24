import {Component, Input, OnInit} from '@angular/core';
import {
    StructureDefinitionImplementationnGuide,
    StructureDefinitionOptions
} from '../../services/structure-definition.service';
import {ImplementationGuideService} from '../../services/implementation-guide.service';
import {ImplementationGuideListItemModel} from '../../models/implementation-guide-list-item-model';
import {ConfigService} from '../../services/config.service';
import * as _ from 'underscore';

@Component({
    selector: 'app-implementation-guides-panel',
    templateUrl: './implementation-guides-panel.component.html',
    styleUrls: ['./implementation-guides-panel.component.css']
})
export class ImplementationGuidesPanelComponent implements OnInit {
    @Input() options = new StructureDefinitionOptions();
    public implementationGuides: ImplementationGuideListItemModel[];
    public newImplementationGuide: StructureDefinitionImplementationnGuide;

    constructor(
        private implementationGuideService: ImplementationGuideService,
        private configService: ConfigService) {
    }

    addImplementationGuide() {
        this.newImplementationGuide = new StructureDefinitionImplementationnGuide();
        this.newImplementationGuide.isNew = true;
    }

    doneAdding() {
        this.options.implementationGuides.push(this.newImplementationGuide);
        this.newImplementationGuide = null;
    }

    removeImplementationGuide(ig: StructureDefinitionImplementationnGuide) {
        if (ig.isNew) {
            const index = this.options.implementationGuides.indexOf(ig);
            this.options.implementationGuides.splice(index, 1);
        } else {
            ig.isRemoved = true;
        }
    }

    getUnusedImplementationGuides(): ImplementationGuideListItemModel[] {
        return _.filter(this.implementationGuides, (implementationGuide) => {
            return !_.find(this.options.implementationGuides, (next) => next.id === implementationGuide.id);
        });
    }

    setNewImplementationGuide(id: string) {
        const foundImplementationGuide = _.find(this.implementationGuides, (implementationGuide) => implementationGuide.id === id);

        if (foundImplementationGuide) {
            this.newImplementationGuide.id = foundImplementationGuide.id;
            this.newImplementationGuide.name = foundImplementationGuide.name;
        }
    }

    ngOnInit() {
        this.implementationGuideService.getImplementationGuides()
            .subscribe((implementationGuides) => {
                this.implementationGuides = implementationGuides;
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while retrieving implementation guides');
            });
    }
}
