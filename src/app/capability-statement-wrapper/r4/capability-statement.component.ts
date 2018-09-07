import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../../services/capability-statement.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CapabilityStatement, Coding, EventComponent, ResourceComponent, RestComponent} from '../../models/stu3/fhir';
import {Globals} from '../../globals';
import {Observable} from 'rxjs';
import {RecentItemService} from '../../services/recent-item.service';
import {FhirService} from '../../services/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirEditCapabilityStatementResourceModalComponent} from '../../fhir-edit/capability-statement-resource-modal/capability-statement-resource-modal.component';
import {FhirEditMessagingEventModalComponent} from '../../fhir-edit/messaging-event-modal/messaging-event-modal.component';
import {FileService} from '../../services/file.service';

@Component({
    selector: 'app-capability-statement',
    templateUrl: './capability-statement.component.html',
    styleUrls: ['./capability-statement.component.css']
})
export class CapabilityStatementComponent implements OnInit, DoCheck {
    @Input() public capabilityStatement = new CapabilityStatement();
    public message: string;
    public validation: any;
    public messageEventCodes: Coding[] = [];
    public messageTransportCodes: Coding[] = [];

    constructor(
        public globals: Globals,
        private modalService: NgbModal,
        private csService: CapabilityStatementService,
        private route: ActivatedRoute,
        private router: Router,
        private fileService: FileService,
        private recentItemService: RecentItemService,
        private fhirService: FhirService) {

    }

    public get isNew(): boolean {
        const id  = this.route.snapshot.paramMap.get('id');
        return !id || id === 'new';
    }

    public revert() {
        this.getCapabilityStatement()
            .subscribe(() => {
                this.message = 'Reverted capability statement changes';
                setTimeout(() => {
                    this.message = null;
                }, 3000);
            }, (err) => {
                this.message = 'An error occurred while reverting the capability statement changes';
            });
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

    private getCapabilityStatement(): Observable<CapabilityStatement> {
        const capabilityStatementId  = this.route.snapshot.paramMap.get('id');

        if (capabilityStatementId === 'from-file') {
            if (this.fileService.file) {
                return new Observable<CapabilityStatement>((observer) => {
                    this.capabilityStatement = <CapabilityStatement> this.fileService.file.resource;
                    observer.next(this.capabilityStatement);
                });
            } else {
                this.router.navigate(['/']);
                return;
            }
        }

        return new Observable<CapabilityStatement>((observer) => {
            if (capabilityStatementId === 'new') {
                observer.next(this.capabilityStatement);
            } else if (capabilityStatementId) {
                this.csService.get(capabilityStatementId)
                    .subscribe((cs) => {
                        this.capabilityStatement = cs;
                        observer.next(cs);
                    }, (err) => {
                        observer.error(err);
                    });
            }
        });
    }

    ngOnInit() {
        this.messageTransportCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-transport');
        this.messageEventCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/message-events');
        this.getCapabilityStatement()
            .subscribe((cs) => {
                this.recentItemService.ensureRecentItem(
                    this.globals.cookieKeys.recentCapabilityStatements,
                    cs.id,
                    cs.name || cs.title);
            });
    }

    ngDoCheck() {
        this.validation = this.fhirService.validate(this.capabilityStatement);
    }
}
