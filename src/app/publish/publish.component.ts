import {Component, OnInit, ViewChild} from '@angular/core';
import {Bundle, ImplementationGuide, OperationOutcome} from '../models/stu3/fhir';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {ExportOptions, ExportService} from '../shared/export.service';
import {Globals} from '../globals';
import {ConfigService} from '../shared/config.service';
import {CookieService} from 'angular2-cookie/core';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import * as _ from 'underscore';
import {ExportFormats} from '../models/export-formats.enum';
import {FhirService} from '../shared/fhir.service';
import {HtmlExportStatus, SocketService} from '../shared/socket.service';
import {saveAs} from 'file-saver';
import {ServerValidationResult} from '../models/server-validation-result';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
    public selectedImplementationGuide: ImplementationGuide;
    public options = new ExportOptions();
    public searching = false;
    public message: string;
    public validation: ServerValidationResult[];
    public socketOutput = '';
    public Globals = Globals;

    private packageId;

    @ViewChild('tabs')
    private tabs: NgbTabset;

    constructor(
        public route: ActivatedRoute,
        private socketService: SocketService,
        private fhirService: FhirService,
        private implementationGuideService: ImplementationGuideService,
        private cookieService: CookieService,
        private configService: ConfigService,
        private exportService: ExportService) {

        this.options.exportFormat = ExportFormats.HTML;
        this.options.executeIgPublisher = true;
        this.options.implementationGuideId = !this.route.snapshot.paramMap.get('id') ? this.cookieService.get(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer) : this.route.snapshot.paramMap.get('id');
        this.options.responseFormat = <any> this.cookieService.get(Globals.cookieKeys.lastResponseFormat) || 'application/json';

        // Handle intermittent disconnects mid-export by notifying the server that we are currently exporting the given packageId
        this.socketService.onConnected.subscribe(() => {
            if (this.packageId) {
                this.socketService.notifyExporting(this.packageId);
            }
        });
    }

    public implementationGuideChanged(implementationGuide: ImplementationGuide) {
        this.selectedImplementationGuide = implementationGuide;
        this.options.implementationGuideId = implementationGuide ? implementationGuide.id : undefined;
        this.validation = null;

        const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer;

        if (implementationGuide && implementationGuide.id) {
            this.cookieService.put(cookieKey, implementationGuide.id);
        } else if (this.cookieService.get(cookieKey)) {
            this.cookieService.remove(cookieKey);
        }

        if (implementationGuide && implementationGuide.id) {
            this.exportService.validate(implementationGuide.id)
                .subscribe(
                    (results) => {
                        this.validation = results;
                    },
                    (err) => this.message = this.fhirService.getErrorString(err)
                );
        }
    }

    public searchImplementationGuide = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap((term) => {
                return this.implementationGuideService.getImplementationGuides(1, term)
                    .map((bundle) => {
                        return _.map(bundle.entry, (entry) => <ImplementationGuide> entry.resource);
                    });
            }),
            tap(() => this.searching = false)
        );
    }

    public searchFormatter = (ig: ImplementationGuide) => {
        return `${ig.name} (id: ${ig.id})`;
    }

    public clearImplementationGuide() {
        const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer;

        this.selectedImplementationGuide =
            this.options.implementationGuideId = null;

        if (this.cookieService.get(cookieKey)) {
            this.cookieService.remove(cookieKey);
        }
    }

    public get publishDisabled(): boolean {
        return !this.options.implementationGuideId || !this.options.responseFormat;
    }

    public responseFormatChanged() {
        this.cookieService.put(Globals.cookieKeys.lastResponseFormat, this.options.responseFormat);
    }

    public publish() {
        this.socketOutput = '';
        this.tabs.select('status');

        this.exportService.export(this.options)
            .subscribe((results: any) => {
                const reader = new FileReader();
                reader.addEventListener('loadend', (e: any) => {
                    this.packageId = e.srcElement.result;
                });
                reader.readAsText(results.body);
            }, (err) => {
                this.message = this.fhirService.getErrorString(err);
            });
    }

    public ngOnInit() {
        if (this.options.implementationGuideId) {
            this.implementationGuideService.getImplementationGuide(this.options.implementationGuideId)
                .subscribe((implementationGuide: ImplementationGuide) => {
                    this.implementationGuideChanged(implementationGuide);
                }, (err) => this.message = this.fhirService.getErrorString(err));
        }

        this.socketService.onHtmlExport.subscribe((data: HtmlExportStatus) => {
            if (data.packageId === this.packageId) {
                this.socketOutput += data.message;

                if (!data.message.endsWith('\n')) {
                    this.socketOutput += '\r\n';
                }

                if (data.status === 'complete') {
                    this.message = 'Done exporting';

                    let shouldDownload = this.options.downloadOutput;

                    if (this.options.exportFormat === ExportFormats.HTML && !this.options.executeIgPublisher) {
                        shouldDownload = true;
                    }

                    if (shouldDownload) {
                        const igName = this.selectedImplementationGuide.name.replace(/\s/g, '_');

                        this.exportService.getPackage(this.packageId)
                            .subscribe((results: any) => {
                                saveAs(results.body, igName + '.zip');
                            });
                    }
                }
            }
        }, (err) => {
            this.socketOutput += 'An error occurred while communicating with the server for the export: ' + this.fhirService.getErrorString(err);
        });
    }

}
