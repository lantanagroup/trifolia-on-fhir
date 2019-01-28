import {Component, OnInit, ViewChild} from '@angular/core';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {saveAs} from 'file-saver';
import {ExportOptions, ExportService} from '../services/export.service';
import {ExportFormats} from '../models/export-formats.enum';
import * as _ from 'underscore';
import {SocketMessage, SocketService} from '../services/socket.service';
import {Globals} from '../globals';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../services/config.service';
import {Bundle, DomainResource, ImplementationGuide} from '../models/stu3/fhir';
import {GithubService} from '../services/github.service';
import {FhirService} from '../services/fhir.service';
import {Observable} from 'rxjs';
import {ExportGithubPanelComponent} from '../export-github-panel/export-github-panel.component';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
    public message: string;
    public socketOutput = '';
    private packageId;
    public implementationGuidesBundle: Bundle;
    public githubResourcesBundle: Bundle;
    public githubCommitMessage: string;

    @ViewChild('githubPanel') githubPanel: ExportGithubPanelComponent;

    public options = new ExportOptions();

    constructor(
        private implementationGuideService: ImplementationGuideService,
        private socketService: SocketService,
        private exportService: ExportService,
        private globals: Globals,
        private cookieService: CookieService,
        private githubService: GithubService,
        private fhirService: FhirService,
        private configService: ConfigService) {

        this.options.implementationGuideId = this.cookieService.get(this.globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer);

        // Handle intermittent disconnects mid-export by notifying the server that we are currently exporting the given packageId
        this.socketService.onConnected.subscribe(() => {
            if (this.packageId) {
                this.socketService.notifyExporting(this.packageId);
            }
        });
    }

    public get exportDisabled(): boolean {
        if (!this.options.implementationGuideId || !this.options.exportFormat) {
            return true;
        }

        if (this.options.exportFormat === ExportFormats.GitHub) {
            if (!this.githubService.token || !this.githubResourcesBundle || !this.githubResourcesBundle.entry) {
                return true;
            }

            const filtered = _.filter(this.githubResourcesBundle.entry, (entry) => {
                return this.fhirService.getResourceGithubDetails(entry.resource).hasAllDetails();
            });

            if (filtered.length === 0 || !this.githubCommitMessage) {
                return true;
            }

            return false;
        }

        return !this.options.responseFormat;
    }

    public get implementationGuides() {
        if (!this.implementationGuidesBundle) {
            return [];
        }

        return _.map(this.implementationGuidesBundle.entry, (entry) => <ImplementationGuide> entry.resource);
    }

    public exportFormatChanged() {
        if (this.options.exportFormat === ExportFormats.GitHub) {
            this.message = 'Retrieving resources for IG to determine options for GitHub';

            this.exportService.export({ implementationGuideId: this.options.implementationGuideId, exportFormat: ExportFormats.Bundle })
                .subscribe((response) => {
                    const reader = new FileReader();

                    reader.addEventListener('loadend', (e) => {
                        const bundleJson = (<any> e.srcElement).result;

                        try {
                            this.githubResourcesBundle = <Bundle> JSON.parse(bundleJson);
                            this.message = '';
                        } catch (ex) {
                            this.message = 'Could not parse the bundle: ' + ex.message;
                        }
                    });

                    reader.readAsText(response.body);
                }, (err) => {
                    this.message = err.message || err.data || err;
                });
        }
    }

    private exportGithub() {
        const queue = <DomainResource[]> _.chain(this.githubResourcesBundle.entry)
            .filter((entry) => {
                const details = this.fhirService.getResourceGithubDetails(entry.resource);
                return !!(details.owner && details.repository && details.branch && details.path);
            })
            .filter((entry) => {
                return !!_.find(this.githubPanel.checkedIds, (id) => id === entry.resource.id);
            })
            .map((entry) => entry.resource)
            .value();

        const nextInQueue = () => {
            return new Observable((observer) => {
                if (queue.length === 0) {
                    observer.next();
                    observer.complete();
                    return;
                }

                const resource = queue.pop();
                const details = this.fhirService.getResourceGithubDetails(resource);

                let content = JSON.stringify(resource, null, '\t');

                if (details.path.endsWith('.xml')) {
                    content = this.fhirService.serialize(resource);
                }

                this.githubService.updateContent(details.owner, details.repository, details.path, content, this.githubCommitMessage, details.branch)
                    .subscribe(() => {
                        nextInQueue()
                            .subscribe(() => {
                                observer.next();
                                observer.complete();
                            }, (err) => {
                                observer.error(err);
                                observer.complete();
                            });
                    }, (err) => {
                        observer.error(err);
                        observer.complete();
                    });
            });
        }

        nextInQueue()
            .subscribe(() => {
                this.message = 'Done exporting to GitHub';
            }, (err) => {
                this.message = err.message || err.data || err;
            });
    }

    public export() {
        this.socketOutput = '';
        this.message = 'Exporting...';

        this.cookieService.put(this.globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer, this.options.implementationGuideId);

        if (this.options.exportFormat === ExportFormats.GitHub) {
            this.exportGithub();
        } else {
            this.exportService.export(this.options)
                .subscribe((results: any) => {
                    if (this.options.exportFormat === ExportFormats.Bundle) {
                        const ig = _.find(this.implementationGuides, (next) => next.id === this.options.implementationGuideId);
                        const igName = ig.name.replace(/\s/g, '_');
                        const extension = (this.options.responseFormat === 'application/xml' ? '.xml' : '.json');

                        this.message = 'Done exporting';

                        saveAs(results.body, igName + extension);
                    } else if (this.options.exportFormat === ExportFormats.HTML) {
                        const reader = new FileReader();
                        reader.addEventListener('loadend', (e: any) => {
                            this.packageId = e.srcElement.result;
                        });
                        reader.readAsText(results.body);
                    }
                }, (err) => {
                    this.message = err;
                });
        }
    }

    ngOnInit() {
        this.implementationGuideService.getImplementationGuides()
            .subscribe((results) => {
                this.implementationGuidesBundle = results;
            }, (err) => {
                this.message = err;
            });

        this.socketService.onMessage.subscribe((data: SocketMessage) => {
            if (data.packageId === this.packageId) {
                this.socketOutput += data.message;

                if (!data.message.endsWith('\n')) {
                    this.socketOutput += '\r\n';
                }

                if (data.status === 'complete') {
                    this.message = 'Done exporting';

                    if (this.options.downloadOutput) {
                        const ig = _.find(this.implementationGuides, (next) => next.id === this.options.implementationGuideId);
                        const igName = ig.name.replace(/\s/g, '_');

                        this.exportService.getPackage(this.packageId)
                            .subscribe((results: any) => {
                                saveAs(results.body, igName + '.zip');
                            });
                    }
                }
            }
        }, (err) => {
            this.socketOutput += 'An error occurred while communicating with the server for the export';
        });
    }
}
