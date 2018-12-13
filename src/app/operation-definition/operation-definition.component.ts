import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {OperationDefinition, OperationOutcome, ParameterComponent} from '../models/stu3/fhir';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {OperationDefinitionService} from '../services/operation-definition.service';
import {RecentItemService} from '../services/recent-item.service';
import {Globals} from '../globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ParameterModalComponent} from './parameter-modal/parameter-modal.component';
import {FhirService} from '../services/fhir.service';
import {FileService} from '../services/file.service';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-operation-definition',
    templateUrl: './operation-definition.component.html',
    styleUrls: ['./operation-definition.component.css']
})
export class OperationDefinitionComponent implements OnInit, OnDestroy, DoCheck {
    @Input() public operationDefinition: OperationDefinition = new OperationDefinition();
    public message: string;
    public validation: any;
    private navSubscription: any;

    constructor(
        public globals: Globals,
        private modal: NgbModal,
        private route: ActivatedRoute,
        private router: Router,
        private configService: ConfigService,
        private opDefService: OperationDefinitionService,
        private recentItemService: RecentItemService,
        private fileService: FileService,
        private fhirService: FhirService) {

    }

    public get isNew(): boolean {
        const id  = this.route.snapshot.paramMap.get('id');
        return !id || id === 'new';
    }

    public editParameter(parameter: ParameterComponent) {
        const modalInstance = this.modal.open(ParameterModalComponent, { size: 'lg' });
        modalInstance.componentInstance.operationDefinition = this.operationDefinition;
        modalInstance.componentInstance.parameter = parameter;
    }

    public revert() {
        this.getOperationDefinition();
    }

    public save() {
        const operationDefinitionId = this.route.snapshot.paramMap.get('id');

        if (!this.validation.valid && !confirm('This operation definition is not valid, are you sure you want to save?')) {
            return;
        }

        if (operationDefinitionId === 'from-file') {
            this.fileService.saveFile();
            return;
        }

        this.opDefService.save(this.operationDefinition)
            .subscribe((results: OperationDefinition) => {
                if (!this.operationDefinition.id) {
                    this.router.navigate(['/operation-definition/' + results.id]);
                } else {
                    this.recentItemService.ensureRecentItem(this.globals.cookieKeys.recentOperationDefinitions, results.id, results.name);
                    this.message = 'Successfully saved operation definition!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = 'An error occured while saving the operation definition';
            });
    }

    private getOperationDefinition() {
        const operationDefinitionId = this.route.snapshot.paramMap.get('id');

        if (operationDefinitionId === 'from-file') {
            if (this.fileService.file) {
                this.operationDefinition = <OperationDefinition> this.fileService.file.resource;
                this.nameChanged();
            } else {
                this.router.navigate(['/']);
                return;
            }
        }

        if (operationDefinitionId !== 'new' && operationDefinitionId) {
            this.operationDefinition = null;

            this.opDefService.get(operationDefinitionId)
                .subscribe((opDef: OperationDefinition | OperationOutcome) => {
                    if (opDef.resourceType !== 'OperationDefinition') {
                        this.message = 'The specified operation definition either does not exist or was deleted';
                        return;
                    }

                    this.operationDefinition = <OperationDefinition> opDef;
                    this.nameChanged();
                    this.recentItemService.ensureRecentItem(
                        this.globals.cookieKeys.recentOperationDefinitions,
                        this.operationDefinition.id,
                        this.operationDefinition.name);
                }, (err) => {
                    this.message = err && err.message ? err.message : 'Error loading operation definition';
                    this.recentItemService.removeRecentItem(this.globals.cookieKeys.recentOperationDefinitions, operationDefinitionId);
                });
        }
    }

    nameChanged() {
        this.configService.setTitle(`OperationDefinition - ${this.operationDefinition.name || 'no-name'}`);
    }

    ngOnInit() {
        this.navSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd && e.url.startsWith('/operation-definition/')) {
                this.getOperationDefinition();
            }
        });
        this.getOperationDefinition();
    }

    ngOnDestroy() {
        this.navSubscription.unsubscribe();
        this.configService.setTitle(null);
    }

    ngDoCheck() {
        if (this.operationDefinition) {
            this.validation = this.fhirService.validate(this.operationDefinition);
        }
    }
}
