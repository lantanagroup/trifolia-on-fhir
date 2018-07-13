import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {CapabilityStatementService} from '../services/capability-statement.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CapabilityStatement, Coding, ImplementationGuide, UsageContext} from '../models/fhir';
import {Globals} from '../globals';
import {Observable} from 'rxjs/Observable';
import {RecentItemService} from '../services/recent-item.service';
import {FhirService} from '../services/fhir.service';

@Component({
    selector: 'app-capability-statement',
    templateUrl: './capability-statement.component.html',
    styleUrls: ['./capability-statement.component.css'],
    providers: [FhirService]
})
export class CapabilityStatementComponent implements OnInit, DoCheck {
    @Input() public capabilityStatement = new CapabilityStatement();
    public message: string;
    public validation: any;

    constructor(
        public globals: Globals,
        private csService: CapabilityStatementService,
        private route: ActivatedRoute,
        private router: Router,
        private recentItemService: RecentItemService,
        private fhirService: FhirService) {

    }

    public save() {
        if (!this.validation.valid && !confirm('This capability statement is not valid, are you sure you want to save?')) {
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

    private getCapabilityStatement(): Observable<CapabilityStatement> {
        const capabilityStatementId  = this.route.snapshot.paramMap.get('id');

        return new Observable<CapabilityStatement>((observer) => {
            if (capabilityStatementId) {
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
