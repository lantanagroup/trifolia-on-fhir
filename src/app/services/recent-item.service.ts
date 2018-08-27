import {Injectable} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {Globals} from '../globals';
import {RecentItemModel} from '../models/recent-item-model';
import * as _ from 'underscore';
import {ConfigService} from './config.service';

@Injectable()
export class RecentItemService {
    public recentImplementationGuides: RecentItemModel[] = [];
    public recentStructureDefinitions: RecentItemModel[] = [];
    public recentCapabilityStatements: RecentItemModel[] = [];
    public recentOperationDefinitions: RecentItemModel[] = [];
    public recentValueSets: RecentItemModel[] = [];
    public recentCodeSystems: RecentItemModel[] = [];

    constructor(
        private cookieService: CookieService,
        private globals: Globals,
        private configService: ConfigService) {

        this.configService.fhirServerChanged.subscribe(() => this.loadRecentItems());
    }

    private loadRecentItems() {
        const fhirServer = this.configService.fhirServer;

        const recentImplementationGuidesKey = this.globals.cookieKeys.recentImplementationGuides + '-' + fhirServer;
        const recentStructureDefinitionsKey = this.globals.cookieKeys.recentStructureDefinitions + '-' + fhirServer;
        const recentCapabilityStatementsKey = this.globals.cookieKeys.recentCapabilityStatements + '-' + fhirServer;
        const recentOperationDefinitionsKey = this.globals.cookieKeys.recentOperationDefinitions + '-' + fhirServer;
        const recentValueSetsKey = this.globals.cookieKeys.recentValueSets + '-' + fhirServer;
        const recentCodeSystemsKey = this.globals.cookieKeys.recentCodeSystems + '-' + fhirServer;

        this.recentImplementationGuides = <RecentItemModel[]> this.cookieService.getObject(recentImplementationGuidesKey) || [];
        this.recentStructureDefinitions = <RecentItemModel[]> this.cookieService.getObject(recentStructureDefinitionsKey) || [];
        this.recentCapabilityStatements = <RecentItemModel[]> this.cookieService.getObject(recentCapabilityStatementsKey) || [];
        this.recentOperationDefinitions = <RecentItemModel[]> this.cookieService.getObject(recentOperationDefinitionsKey) || [];
        this.recentValueSets = <RecentItemModel[]> this.cookieService.getObject(recentValueSetsKey) || [];
        this.recentCodeSystems = <RecentItemModel[]> this.cookieService.getObject(recentCodeSystemsKey) || [];
    }

    public ensureRecentItem(requestedCookieKey: string, id: string, display: string) {
        if (!id) {
            return;
        }

        const fhirServer = this.configService.fhirServer;
        const cookieKey = requestedCookieKey + '-' + fhirServer;
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

    public removeRecentItem(requestedCookieKey: string, id: string) {
        if (!id) {
            return;
        }

        const fhirServer = this.configService.fhirServer;
        const cookieKey = requestedCookieKey + '-' + fhirServer;
        const items: RecentItemModel[] = this.getCollection(cookieKey);
        const foundItem = _.find(items, (rig) => rig.id === id);

        if (foundItem) {
            const foundItemIndex = items.indexOf(foundItem);
            items.splice(foundItemIndex, 1);

            this.cookieService.putObject(cookieKey, items);
        }
    }

    private getCollection(cookieKey: string): RecentItemModel[] {
        const fhirServer = this.configService.fhirServer;

        switch (cookieKey) {
            case this.globals.cookieKeys.recentImplementationGuides + '-' + fhirServer:
                return this.recentImplementationGuides;
            case this.globals.cookieKeys.recentStructureDefinitions + '-' + fhirServer:
                return this.recentStructureDefinitions;
            case this.globals.cookieKeys.recentCapabilityStatements + '-' + fhirServer:
                return this.recentCapabilityStatements;
            case this.globals.cookieKeys.recentOperationDefinitions + '-' + fhirServer:
                return this.recentOperationDefinitions;
            case this.globals.cookieKeys.recentValueSets + '-' + fhirServer:
                return this.recentValueSets;
            case this.globals.cookieKeys.recentCodeSystems + '-' + fhirServer:
                return this.recentCodeSystems;
            default:
                throw new Error('Unexpected cookieKey value');
        }
    }
}
