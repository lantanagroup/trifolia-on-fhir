import {Injectable} from '@angular/core';
import {AuditEvent, Coding, Bundle, OperationOutcome, Identifier} from '../models/fhir';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import * as _ from 'underscore';
import {Globals} from '../globals';

@Injectable()
export class AuditEventService {
    public recentImplementationGuides = [];
    public recentStructureDefinitions = [];

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private globals: Globals) {

        // Wait for authentication to initialize
        this.authService.authChanged
            .subscribe(() => {
                // If a user is authenticated, search for AuditEvent resources associated with
                // the logged-in user to determine if they have any recent IGs or SDs
                if (this.authService.userProfile) {
                    this.search(this.authService.userProfile.sub)
                        .subscribe((res: Bundle) => {
                            // Find recent ImplementationGuides in the results
                            this.recentImplementationGuides = _.chain(res.entry)
                                .filter((entry) => {
                                    return _.find(entry.resource.entity, (entity) =>
                                        entity.identifier &&
                                        entity.identifier.system === this.globals.FHIRUrls.ImplementationGuide);
                                })
                                .uniq((entry) => entry.resource.entity[0].identifier.value)
                                .first(5)
                                .map((entry) => entry.resource.entity[0].identifier.value)
                                .value();

                            // Find recent StructureDefinitions in the results
                            this.recentStructureDefinitions = _.chain(res.entry)
                                .filter((entry) => {
                                    return _.find(entry.resource.entity, (entity) =>
                                        entity.identifier &&
                                        entity.identifier.system === this.globals.FHIRUrls.StructureDefinition);
                                })
                                .uniq((entry) => entry.resource.entity[0].identifier.value)
                                .first(5)
                                .map((entry) => entry.resource.entity[0].identifier.value)
                                .value();
                        });
                }
            });
    }

    getTypeCoding(typeCode: string): Coding {
        const coding: Coding = {
            system: 'http://hl7.org/fhir/ValueSet/audit-event-type',
            code: typeCode
        };

        switch (typeCode) {
            case '110100':
                coding.display = 'Audit event: Application Activity has taken place';
                break;
        }

        return coding;
    }

    /**
     * Creates an AuditEvent resource model based on the criteria specified,
     * defaulting some values to Trifolia-on-FHIR specific details (such as agent,
     * who is the logged-in user, and the source, which is always trifolia-on-fhir)
     * @param {string} typeCode The type of event
     * @param {Identifier} entityIdentifier The identifier of the entity being audited
     * @returns {AuditEvent} An AuditEvent model
     */
    getModel(typeCode: string, entityIdentifier?: Identifier) {
        let userId = null;

        if (this.authService.userProfile && this.authService.userProfile.sub) {
            const subSplit = this.authService.userProfile.sub.split('|');
            if (subSplit.length === 1) {
                userId = {
                    value: this.authService.userProfile.sub
                };
            } else if (subSplit.length === 2) {
                userId = {
                    system: subSplit[0],
                    value: subSplit[1]
                };
            } else if (subSplit.length > 2) {
                userId = {
                    value: this.authService.userProfile.sub.replace('|', '%7F')
                };
            }
        }

        const auditEvent: AuditEvent = {
            resourceType: 'AuditEvent',
            type: this.getTypeCoding(typeCode),
            recorded: new Date(),
            agent: [{
                requestor: false,
                userId: userId
            }],
            source: {
                identifier: {
                    value: 'trifolia-on-fhir'
                }
            }
        };

        if (entityIdentifier) {
            auditEvent.entity = [{
                identifier: entityIdentifier
            }];
        }

        return auditEvent;
    }

    search(user: string) {
        let url = '/api/auditEvent?';

        if (user) {
            url += 'user=' + encodeURIComponent(user) + '&';
        }

        return this.http.get(url);
    }

    /**
     * Persists the AuditEvent resource as a new resource on the server
     * @param {AuditEvent} auditEvent The AuditEvent resource to save to the server
     * @returns {Observable<Object>} An observable that can be subscribed to, which will complete when the server has saved the AuditEvent
     */
    create(auditEvent: AuditEvent) {
        const results = this.http.post('/api/auditEvent', auditEvent);
        results.subscribe((res) => {
            // If an entity has been specified on the AuditEvent, it may be an ImplementationGuide
            // or an StructureDefinition, and we would want to add that to the list of recent IGs and SDs
            if (auditEvent.entity && auditEvent.entity.length > 0) {
                if (auditEvent.entity[0].identifier.system === this.globals.FHIRUrls.ImplementationGuide) {
                    const igId = auditEvent.entity[0].identifier.value;
                    if (this.recentImplementationGuides.indexOf(igId) < 0) {
                        this.recentImplementationGuides.push(igId);
                    }
                }

                if (auditEvent.entity[0].identifier.system === this.globals.FHIRUrls.StructureDefinition) {
                    const sdId = auditEvent.entity[0].identifier.value;
                    if (this.recentStructureDefinitions.indexOf(sdId) < 0) {
                        this.recentStructureDefinitions.push(sdId);
                    }
                }
            }
        }, (err) => {
            console.error('Error saving audit entry to server: ' + err);
        });
        return results;
    }
}
