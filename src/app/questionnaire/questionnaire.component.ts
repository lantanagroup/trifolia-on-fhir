import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {ConceptSetComponent, OperationOutcome, Questionnaire, ValueSet} from '../models/stu3/fhir';
import {Globals} from '../globals';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RecentItemService} from '../services/recent-item.service';
import {FileService} from '../services/file.service';
import {FhirService} from '../services/fhir.service';
import {QuestionnaireService} from '../services/questionnaire.service';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit, OnDestroy, DoCheck {
    @Input() public questionnaire = new Questionnaire();
    public message: string;
    public validation: any;
    private navSubscription: any;

    constructor(
        public globals: Globals,
        private questionnaireService: QuestionnaireService,
        private route: ActivatedRoute,
        private router: Router,
        private configService: ConfigService,
        private modalService: NgbModal,
        private recentItemService: RecentItemService,
        private fileService: FileService,
        private fhirService: FhirService) {
    }

    public get isNew(): boolean {
        const id  = this.route.snapshot.paramMap.get('id');
        return !id || id === 'new';
    }

    public revert() {
        this.getQuestionnaire();
    }

    public save() {
        const questionnaireId = this.route.snapshot.paramMap.get('id');

        if (!this.validation.valid && !confirm('This questionnaire is not valid, are you sure you want to save?')) {
            return;
        }

        if (questionnaireId === 'from-file') {
            this.fileService.saveFile();
            return;
        }

        this.questionnaireService.save(this.questionnaire)
            .subscribe((results: Questionnaire) => {
                if (!this.questionnaire.id) {
                    this.router.navigate(['/questionnaire/' + results.id]);
                } else {
                    this.recentItemService.ensureRecentItem(
                        this.globals.cookieKeys.recentQuestionnaires,
                        results.id,
                        results.name || results.title);
                    this.message = 'Successfully saved questionnaire!';
                    setTimeout(() => { this.message = ''; }, 3000);
                }
            }, (err) => {
                this.message = 'An error occured while saving the questionnaire';
            });
    }

    private getQuestionnaire() {
        const questionnaireId  = this.route.snapshot.paramMap.get('id');

        if (questionnaireId === 'from-file') {
            if (this.fileService.file) {
                this.questionnaire = <Questionnaire> this.fileService.file.resource;
                this.nameChanged();
            } else {
                this.router.navigate(['/']);
                return;
            }
        }

        if (questionnaireId !== 'new' && questionnaireId) {
            this.questionnaire = null;

            this.questionnaireService.get(questionnaireId)
                .subscribe((questionnaire: Questionnaire | OperationOutcome) => {
                    if (questionnaire.resourceType !== 'Questionnaire') {
                        this.message = 'The specified questionnaire either does not exist or was deleted';
                        return;
                    }

                    this.questionnaire = <Questionnaire> questionnaire;
                    this.nameChanged();
                    this.recentItemService.ensureRecentItem(
                        this.globals.cookieKeys.recentQuestionnaires,
                        questionnaire.id,
                        this.questionnaire.name || this.questionnaire.title);
                }, (err) => {
                    this.message = err && err.message ? err.message : 'Error loading questionnaire';
                    this.recentItemService.removeRecentItem(this.globals.cookieKeys.recentQuestionnaires, questionnaireId);
                });
        }
    }

    ngOnInit() {
        this.navSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd && e.url.startsWith('/questionnaire/')) {
                this.getQuestionnaire();
            }
        });
        this.getQuestionnaire();
    }

    ngOnDestroy() {
        this.navSubscription.unsubscribe();
        this.configService.setTitle(null);
    }

    nameChanged() {
        this.configService.setTitle(`Questionnaire - ${this.questionnaire.title || this.questionnaire.name || 'no-name'}`);
    }

    ngDoCheck() {
        if (this.questionnaire) {
            this.validation = this.fhirService.validate(this.questionnaire);
        }
    }
}
