import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {CapabilityStatement, ImplementationGuide, OperationDefinition, ParameterComponent} from '../models/fhir';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {OperationDefinitionService} from '../services/operation-definition.service';
import {RecentItemService} from '../services/recent-item.service';
import {Globals} from '../globals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OperationDefinitionParameterModalComponent} from '../operation-definition-parameter-modal/operation-definition-parameter-modal.component';
import {FhirService} from '../services/fhir.service';

@Component({
    selector: 'app-operation-definition',
    templateUrl: './operation-definition.component.html',
    styleUrls: ['./operation-definition.component.css'],
    providers: [FhirService]
})
export class OperationDefinitionComponent implements OnInit, DoCheck {
    @Input() public operationDefinition: OperationDefinition = new OperationDefinition();
    public message: string;
    public validation: any;

    constructor(
        public globals: Globals,
        private modal: NgbModal,
        private route: ActivatedRoute,
        private router: Router,
        private opDefService: OperationDefinitionService,
        private recentItemService: RecentItemService,
        private fhirService: FhirService) {

    }

    public editParameter(parameter: ParameterComponent) {
        const modalInstance = this.modal.open(OperationDefinitionParameterModalComponent, { size: 'lg' });
        modalInstance.componentInstance.operationDefinition = this.operationDefinition;
        modalInstance.componentInstance.parameter = parameter;
    }

    public save() {
        if (!this.validation.valid && !confirm('This operation definition is not valid, are you sure you want to save?')) {
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

        return new Observable<OperationDefinition>((observer) => {
            if (operationDefinitionId) {
                this.opDefService.get(operationDefinitionId)
                    .subscribe((opDef) => {
                        this.operationDefinition = opDef;
                        observer.next(opDef);
                    }, (err) => {
                        observer.error(err);
                    });
            }
        });
    }

    ngOnInit() {
        this.getOperationDefinition()
            .subscribe((opDef) => {
                this.recentItemService.ensureRecentItem(this.globals.cookieKeys.recentOperationDefinitions, this.operationDefinition.id, this.operationDefinition.name);
            });
    }

    ngDoCheck() {
        this.validation = this.fhirService.validate(this.operationDefinition);
    }
}
