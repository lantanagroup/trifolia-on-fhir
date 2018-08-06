import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Globals} from '../globals';
import {RecentItemService} from '../services/recent-item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CodeSystemService} from '../services/code-system.service';
import {CapabilityStatement, CodeSystem, ConceptDefinitionComponent} from '../models/fhir';
import {Observable} from 'rxjs/Observable';
import {FhirService} from '../services/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirEditCodesystemConceptModalComponent} from '../fhir-edit/codesystem-concept-modal/codesystem-concept-modal.component';

@Component({
    selector: 'app-codesystem',
    templateUrl: './codesystem.component.html',
    styleUrls: ['./codesystem.component.css'],
    providers: [FhirService]
})
export class CodesystemComponent implements OnInit, DoCheck {
    @Input() public codeSystem = new CodeSystem();
    public message: string;
    public validation: any;

    constructor(
        public globals: Globals,
        private modalService: NgbModal,
        private codeSystemService: CodeSystemService,
        private route: ActivatedRoute,
        private router: Router,
        private recentItemService: RecentItemService,
        private fhirService: FhirService) {
    }

    public editConcept(concept: ConceptDefinitionComponent) {
        const modalRef = this.modalService.open(FhirEditCodesystemConceptModalComponent, { size: 'lg' });
        modalRef.componentInstance.concept = concept;
    }

    public save() {
        if (!this.validation.valid && !confirm('This code system is not valid, are you sure you want to save?')) {
            return;
        }

        this.codeSystemService.save(this.codeSystem)
            .subscribe((results: CodeSystem) => {
                if (!this.codeSystem.id) {
                    this.router.navigate(['/code-system/' + results.id]);
                } else {
                    this.recentItemService.ensureRecentItem(this.globals.cookieKeys.recentCodeSystems, results.id, results.name);
                    this.message = 'Successfully saved code system!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = 'An error occured while saving the code system';
            });
    }

    private getCodeSystem(): Observable<CodeSystem> {
        const codeSystemId  = this.route.snapshot.paramMap.get('id');

        return new Observable<CodeSystem>((observer) => {
            if (codeSystemId) {
                this.codeSystemService.get(codeSystemId)
                    .subscribe((cs) => {
                        this.codeSystem = cs;
                        observer.next(cs);
                    }, (err) => {
                        observer.error(err);
                    });
            }
        });
    }

    ngOnInit() {
        this.getCodeSystem()
            .subscribe((cs) => {
                this.recentItemService.ensureRecentItem(
                    this.globals.cookieKeys.recentCodeSystems,
                    cs.id,
                    cs.name || cs.title);
            });
    }

    ngDoCheck() {
        this.validation = this.fhirService.validate(this.codeSystem);
    }
}
