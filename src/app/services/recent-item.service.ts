import {Injectable} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {Globals} from '../globals';
import {RecentItemModel} from '../models/recent-item-model';
import * as _ from 'underscore';

@Injectable()
export class RecentItemService {
    public recentImplementationGuides: RecentItemModel[];
    public recentStructureDefinitions: RecentItemModel[];
    public recentCapabilityStatements: RecentItemModel[];
    public recentOperationDefinitions: RecentItemModel[];
    public recentValueSets: RecentItemModel[];
    public recentCodeSystems: RecentItemModel[];

    constructor(private cookieService: CookieService, private globals: Globals) {
        this.recentImplementationGuides =
            <RecentItemModel[]> this.cookieService.getObject(this.globals.cookieKeys.recentImplementationGuides) || [];
        this.recentStructureDefinitions =
            <RecentItemModel[]> this.cookieService.getObject(this.globals.cookieKeys.recentStructureDefinitions) || [];
        this.recentCapabilityStatements =
            <RecentItemModel[]> this.cookieService.getObject(this.globals.cookieKeys.recentCapabilityStatements) || [];
        this.recentOperationDefinitions =
            <RecentItemModel[]> this.cookieService.getObject(this.globals.cookieKeys.recentOperationDefinitions) || [];
        this.recentValueSets =
            <RecentItemModel[]> this.cookieService.getObject(this.globals.cookieKeys.recentValueSets) || [];
        this.recentCodeSystems =
            <RecentItemModel[]> this.cookieService.getObject(this.globals.cookieKeys.recentCodeSystems) || [];
    }

    public ensureRecentItem(cookieKey: string, id: string, display: string) {
        if (!id) {
            return;
        }

        let items: RecentItemModel[] = this.getCollection(cookieKey);
        let foundItem = _.find(items, (rig) => rig.id === id);

        if (!foundItem) {
            foundItem = {
                id: id,
                display: display || 'No display name'
            };
            items.push(foundItem);
        } else if (foundItem.display !== display) {
            foundItem.display = display;
        }

        items = _.sortBy(items, (rig) => rig.display);
        this.cookieService.putObject(cookieKey, items);
    }

    public removeRecentItem(cookieKey: string, id: string) {
        if (!id) {
            return;
        }

        const items: RecentItemModel[] = this.getCollection(cookieKey);
        const foundItem = _.find(items, (rig) => rig.id === id);

        if (foundItem) {
            const foundItemIndex = items.indexOf(foundItem);
            items.splice(foundItemIndex, 1);

            this.cookieService.putObject(cookieKey, items);
        }
    }

    private getCollection(cookieKey: string): RecentItemModel[] {
        switch (cookieKey) {
            case this.globals.cookieKeys.recentImplementationGuides:
                return this.recentImplementationGuides;
            case this.globals.cookieKeys.recentStructureDefinitions:
                return this.recentStructureDefinitions;
            case this.globals.cookieKeys.recentCapabilityStatements:
                return this.recentCapabilityStatements;
            case this.globals.cookieKeys.recentOperationDefinitions:
                return this.recentOperationDefinitions;
            case this.globals.cookieKeys.recentValueSets:
                return this.recentValueSets;
            case this.globals.cookieKeys.recentCodeSystems:
                return this.recentCodeSystems;
            default:
                throw new Error('Unexpected cookieKey value');
        }
    }
}
