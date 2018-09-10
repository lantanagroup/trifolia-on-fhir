import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {Globals} from '../globals';
import {RecentItemService} from '../services/recent-item.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CodeSystemService} from '../services/code-system.service';
import {CapabilityStatement, CodeSystem, ConceptDefinitionComponent, ValueSet} from '../models/stu3/fhir';
import {Observable} from 'rxjs';
import {FhirService} from '../services/fhir.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirEditCodesystemConceptModalComponent} from '../fhir-edit/codesystem-concept-modal/codesystem-concept-modal.component';
import {FileService} from '../services/file.service';

@Component({
    selector: 'app-codesystem',
    templateUrl: './codesystem.component.html',
    styleUrls: ['./codesystem.component.css']
})
export class CodesystemComponent implements OnInit, OnDestroy, DoCheck {
    @Input() public codeSystem = new CodeSystem();
    public message: string;
    public validation: any;
    private navSubscription: any;

    constructor(
        public globals: Globals,
        private modalService: NgbModal,
        private codeSystemService: CodeSystemService,
        private route: ActivatedRoute,
        private router: Router,
        private recentItemService: RecentItemService,
        private fileService: FileService,
        private fhirService: FhirService) {
    }

    public get isNew(): boolean {
        const id  = this.route.snapshot.paramMap.get('id');
        return !id || id === 'new';
    }

    public revert() {
        this.getCodeSystem();
    }

    public editConcept(concept: ConceptDefinitionComponent) {
        const modalRef = this.modalService.open(FhirEditCodesystemConceptModalComponent, { size: 'lg' });
        modalRef.componentInstance.concept = concept;
    }

    public save() {
        const codeSystemId = this.route.snapshot.paramMap.get('id');

        if (!this.validation.valid && !confirm('This code system is not valid, are you sure you want to save?')) {
            return;
        }

        if (codeSystemId === 'from-file') {
            this.fileService.saveFile();
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

    private getCodeSystem() {
        const codeSystemId  = this.route.snapshot.paramMap.get('id');

        if (codeSystemId === 'from-file') {
            if (this.fileService.file) {
                this.codeSystem = <CodeSystem> this.fileService.file.resource;
            } else {
                this.router.navigate(['/']);
                return;
            }
        }

        if (codeSystemId !== 'new' && codeSystemId) {
            this.codeSystemService.get(codeSystemId)
                .subscribe((cs) => {
                    this.codeSystem = cs;
                    this.recentItemService.ensureRecentItem(
                        this.globals.cookieKeys.recentCodeSystems,
                        cs.id,
                        cs.name || cs.title);
                }, (err) => {
                    this.message = 'Error loading code system';
                });
        }
    }

    ngOnInit() {
        this.navSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd && e.url.startsWith('/code-system/')) {
                this.getCodeSystem();
            }
        });
        this.getCodeSystem();
    }

    ngOnDestroy() {
        this.navSubscription.unsubscribe();
    }

    ngDoCheck() {
        this.validation = this.fhirService.validate(this.codeSystem);
    }
}
