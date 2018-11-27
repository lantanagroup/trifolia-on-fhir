import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../../services/capability-statement.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CapabilityStatement, Coding, EventComponent, ResourceComponent, RestComponent} from '../../models/stu3/fhir';
import {Globals} from '../../globals';
import {RecentItemService} from '../../services/recent-item.service';
import {FhirService} from '../../services/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirEditCapabilityStatementResourceModalComponent} from '../../fhir-edit/capability-statement-resource-modal/capability-statement-resource-modal.component';
import {FhirEditMessagingEventModalComponent} from '../../fhir-edit/messaging-event-modal/messaging-event-modal.component';
import {FhirEditReferenceModalComponent} from '../../fhir-edit/reference-modal/reference-modal.component';
import {ConfigService} from '../../services/config.service';
import {FileService} from '../../services/file.service';

@Component({
    selector: 'app-stu3-capability-statement',
    templateUrl: './capability-statement.component.html',
    styleUrls: ['./capability-statement.component.css']
})
export class CapabilityStatementComponent implements OnInit, OnDestroy, DoCheck {
    @Input() public capabilityStatement = new CapabilityStatement();
    public message: string;
    public validation: any;
    public messageEventCodes: Coding[] = [];
    public messageTransportCodes: Coding[] = [];
    private navSubscription: any;

    constructor(
        public globals: Globals,
        public fhirService: FhirService,
        public fileService: FileService,
        private modalService: NgbModal,
        private csService: CapabilityStatementService,
        private configService: ConfigService,
        private route: ActivatedRoute,
        private router: Router,
        private recentItemService: RecentItemService) {

    }

    public get isNew(): boolean {
        const id  = this.route.snapshot.paramMap.get('id');
        return !id || id === 'new';
    }

    public revert() {
        this.getCapabilityStatement();
    }

    public save() {
        const capabilityStatementId  = this.route.snapshot.paramMap.get('id');

        if (!this.validation.valid && !confirm('This capability statement is not valid, are you sure you want to save?')) {
            return;
        }

        if (capabilityStatementId === 'from-file') {
            this.fileService.saveFile();
            return;
        }

        this.csService.save(this.capabilityStatement)
            .subscribe((results: CapabilityStatement) => {
                if (!this.capabilityStatement.id) {
                    this.router.navigate(['/capability-statement/' + results.id]);
                } else {
                    this.recentItemService.ensureRecentItem(this.globals.cookieKeys.recentCapabilityStatements, results.id, results.name);
                    this.message = 'Successfully saved capability statement!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = 'An error occured while saving the capability statement';
            });
    }

    public editResource(resource: ResourceComponent) {
        const modalRef = this.modalService.open(FhirEditCapabilityStatementResourceModalComponent, { size: 'lg' });
        modalRef.componentInstance.resource = resource;
    }

    public copyResource(rest: RestComponent, resource: ResourceComponent) {
        const resourceCopy = JSON.parse(JSON.stringify(resource));
        rest.resource.push(resourceCopy);
    }

    public getDefaultMessagingEvent(): EventComponent {
        return {
            code: this.messageEventCodes[0],
            mode: 'sender',
            focus: 'Account',
            request: { reference: '', display: '' },
            response: { reference: '', display: '' }
        };
    }

    public editEvent(event: EventComponent) {
        const modalRef = this.modalService.open(FhirEditMessagingEventModalComponent, { size: 'lg' });
        modalRef.componentInstance.event = event;
    }

    public selectImplementationGuide(implementationGuideIndex) {
        const modalRef = this.modalService.open(FhirEditReferenceModalComponent, { size: 'lg' });
        modalRef.componentInstance.resourceType = 'ImplementationGuide';
        modalRef.componentInstance.hideResourceType = true;

        modalRef.result.then((results: any) => {
            this.capabilityStatement.implementationGuide[implementationGuideIndex] = results.resource.url || results.fullUrl;
        });
    }

    public addRestEntry(restTabSet) {
        this.capabilityStatement.rest.push({ mode: 'client' });
        setTimeout(() => {
            const lastIndex = this.capabilityStatement.rest.length - 1;
            const newRestTabId = 'rest-' + lastIndex.toString();
            restTabSet.select(newRestTabId);
        }, 50);
    }

    public addMessagingEntry(messagingTabSet) {
        this.capabilityStatement.messaging.push({ });
        setTimeout(() => {
            const lastIndex = this.capabilityStatement.messaging.length - 1;
            const newMessagingTabId = 'messaging-' + lastIndex.toString();
            messagingTabSet.select(newMessagingTabId);
        }, 50);
    }

    private getCapabilityStatement() {
        const capabilityStatementId  = this.route.snapshot.paramMap.get('id');

        if (capabilityStatementId === 'from-file') {
            if (this.fileService.file) {
                this.capabilityStatement = <CapabilityStatement> this.fileService.file.resource;
                this.nameChanged();
            } else {
                this.router.navigate(['/']);
                return;
            }
        }

        if (capabilityStatementId !== 'new' && capabilityStatementId) {
            this.capabilityStatement = null;

            this.csService.get(capabilityStatementId)
                .subscribe((cs) => {
                    if (cs.resourceType !== 'CapabilityStatement') {
                        this.message = 'The specified capability statement either does not exist or was deleted';
                        return;
                    }

                    this.capabilityStatement = <CapabilityStatement> cs;
                    this.nameChanged();
                    this.recentItemService.ensureRecentItem(
                        this.globals.cookieKeys.recentCapabilityStatements,
                        this.capabilityStatement.id,
                        this.capabilityStatement.name || this.capabilityStatement.title);
                }, (err) => {
                    this.message = err && err.message ? err.message : 'Error loading capability statement';
                    this.recentItemService.removeRecentItem(this.globals.cookieKeys.recentCapabilityStatements, capabilityStatementId);
                });
        }
    }

    nameChanged() {
        this.configService.setTitle(`CapabilityStatement - ${this.capabilityStatement.title || this.capabilityStatement.name || 'no-name'}`);
    }

    ngOnInit() {
        this.messageTransportCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-transport');
        this.messageEventCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-events');
        this.navSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd && e.url.startsWith('/capability-statement/')) {
                this.getCapabilityStatement();
            }
        });
        this.getCapabilityStatement();
    }

    ngOnDestroy() {
        this.navSubscription.unsubscribe();
        this.configService.setTitle(null);
    }

    ngDoCheck() {
        if (this.capabilityStatement) {
            this.validation = this.fhirService.validate(this.capabilityStatement);
        }
    }
}
