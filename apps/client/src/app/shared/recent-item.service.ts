import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {RecentItemModel} from '../models/recent-item-model';
import {ConfigService} from './config.service';

@Injectable()
export class RecentItemService {
    public recentImplementationGuides: RecentItemModel[] = [];
    public recentStructureDefinitions: RecentItemModel[] = [];
    public recentCapabilityStatements: RecentItemModel[] = [];
    public recentOperationDefinitions: RecentItemModel[] = [];
    public recentValueSets: RecentItemModel[] = [];
    public recentCodeSystems: RecentItemModel[] = [];
    public recentQuestionnaires: RecentItemModel[] = [];

    constructor(
        private cookieService: CookieService,
        private configService: ConfigService) {
        this.loadRecentItems();
        //this.configService.fhirServerChanged.subscribe(() => this.loadRecentItems());
    }

    private loadRecentItems() {
 /*       const fhirServer = this.configService.fhirVersion;

        const recentImplementationGuidesKey = Globals.cookieKeys.recentImplementationGuides + '-' + fhirServer;
        const recentStructureDefinitionsKey = Globals.cookieKeys.recentStructureDefinitions + '-' + fhirServer;
        const recentCapabilityStatementsKey = Globals.cookieKeys.recentCapabilityStatements + '-' + fhirServer;
        const recentOperationDefinitionsKey = Globals.cookieKeys.recentOperationDefinitions + '-' + fhirServer;
        const recentValueSetsKey = Globals.cookieKeys.recentValueSets + '-' + fhirServer;
        const recentCodeSystemsKey = Globals.cookieKeys.recentCodeSystems + '-' + fhirServer;
        const recentQuestionnairesKey = Globals.cookieKeys.recentQuestionnaires + '-' + fhirServer;

        this.recentImplementationGuides = <RecentItemModel[]> JSON.parse(this.cookieService.get(recentImplementationGuidesKey)) || [];
        this.recentStructureDefinitions = <RecentItemModel[]> JSON.parse(this.cookieService.get(recentStructureDefinitionsKey)) || [];
        this.recentCapabilityStatements = <RecentItemModel[]> JSON.parse(this.cookieService.get(recentCapabilityStatementsKey)) || [];
        this.recentOperationDefinitions = <RecentItemModel[]> JSON.parse(this.cookieService.get(recentOperationDefinitionsKey)) || [];
        this.recentValueSets = <RecentItemModel[]> JSON.parse(this.cookieService.get(recentValueSetsKey)) || [];
        this.recentCodeSystems = <RecentItemModel[]> JSON.parse(this.cookieService.get(recentCodeSystemsKey)) || [];
        this.recentQuestionnaires = <RecentItemModel[]> JSON.parse(this.cookieService.get(recentQuestionnairesKey)) || [];*/
    }

    public ensureRecentItem(requestedCookieKey: string, id: string, display: string) {
        if (!id) {
            return;
        }

        const fhirServer = this.configService.fhirVersion;
        const cookieKey = requestedCookieKey + '-' + fhirServer;
        let items: RecentItemModel[] = this.getCollection(cookieKey);
        let foundItem = items.find((rig) => rig.id === id);

        if (!foundItem) {
            foundItem = {
                id: id,
                display: display || 'No display name',
                date: new Date().toISOString()
            };
            items.push(foundItem);
        } else if (foundItem.display !== display) {
            foundItem.display = display;
        }

        foundItem.date = new Date().toISOString();

        items = items.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        items = items.reverse();
        items = items.slice(0, 5);
        this.cookieService.set(cookieKey, JSON.stringify(items));

        switch (requestedCookieKey) {
            case Globals.cookieKeys.recentImplementationGuides:
                this.recentImplementationGuides = items;
                break;
            case Globals.cookieKeys.recentStructureDefinitions:
                this.recentStructureDefinitions = items;
                break;
            case Globals.cookieKeys.recentCapabilityStatements:
                this.recentCapabilityStatements = items;
                break;
            case Globals.cookieKeys.recentOperationDefinitions:
                this.recentOperationDefinitions = items;
                break;
            case Globals.cookieKeys.recentValueSets:
                this.recentValueSets = items;
                break;
            case Globals.cookieKeys.recentCodeSystems:
                this.recentCodeSystems = items;
                break;
            case Globals.cookieKeys.recentQuestionnaires:
                this.recentQuestionnaires = items;
                break;
        }
    }

    public removeRecentItem(requestedCookieKey: string, id: string) {
        if (!id) {
            return;
        }

        const fhirServer = this.configService.fhirVersion;
        const cookieKey = requestedCookieKey + '-' + fhirServer;
        const items: RecentItemModel[] = this.getCollection(cookieKey);
        const foundItem = items.find((rig) => rig.id === id);

        if (foundItem) {
            const foundItemIndex = items.indexOf(foundItem);
            items.splice(foundItemIndex, 1);

            this.cookieService.set(cookieKey, JSON.stringify(items));
        }
    }

    public changeId(cookieKey: string, originalId: string, newId: string) {
        const existing = this.getRecentItem(cookieKey, originalId);

        if (existing) {
            this.removeRecentItem(cookieKey, originalId);
            this.ensureRecentItem(cookieKey, newId, existing.display);
        }
    }

    public getCookieKey(resourceType: string): string {
        switch (resourceType) {
            case 'StructureDefinition':
                return Globals.cookieKeys.recentStructureDefinitions;
            case 'ImplementationGuide':
                return Globals.cookieKeys.recentImplementationGuides;
            case 'OperationDefinition':
                return Globals.cookieKeys.recentOperationDefinitions;
            case 'CapabilityStatement':
                return Globals.cookieKeys.recentCapabilityStatements;
            case 'ValueSet':
                return Globals.cookieKeys.recentValueSets;
            case 'CodeSystem':
                return Globals.cookieKeys.recentCodeSystems;
            case 'Questionnaire':
                return Globals.cookieKeys.recentQuestionnaires;
        }
    }

    private getRecentItem(cookieKey: string, id: string): RecentItemModel {
        const fhirServer = this.configService.fhirVersion;
        const coll = this.getCollection(cookieKey + '-' + fhirServer);

        if (coll) {
            return coll.find((recentItem: RecentItemModel) => recentItem.id === id);
        }
    }

    private getCollection(cookieKey: string): RecentItemModel[] {
        const fhirServer = this.configService.fhirVersion;

        switch (cookieKey) {
            case Globals.cookieKeys.recentImplementationGuides + '-' + fhirServer:
                return this.recentImplementationGuides;
            case Globals.cookieKeys.recentStructureDefinitions + '-' + fhirServer:
                return this.recentStructureDefinitions;
            case Globals.cookieKeys.recentCapabilityStatements + '-' + fhirServer:
                return this.recentCapabilityStatements;
            case Globals.cookieKeys.recentOperationDefinitions + '-' + fhirServer:
                return this.recentOperationDefinitions;
            case Globals.cookieKeys.recentValueSets + '-' + fhirServer:
                return this.recentValueSets;
            case Globals.cookieKeys.recentCodeSystems + '-' + fhirServer:
                return this.recentCodeSystems;
            case Globals.cookieKeys.recentQuestionnaires + '-' + fhirServer:
                return this.recentQuestionnaires;
            default:
                throw new Error('Unexpected cookieKey value');
        }
    }
}
