import {Component, OnInit} from '@angular/core';
import {ImplementationGuideListItemModel} from '../models/implementation-guide-list-item-model';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {saveAs} from 'file-saver';
import {ExportOptions, ExportService} from '../services/export.service';
import {ExportFormats} from '../models/export-formats.enum';
import * as _ from 'underscore';
import {SocketMessage, SocketService} from '../services/socket.service';
import {Globals} from '../globals';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
    public message: string;
    public socketOutput = '';
    private packageId;
    public implementationGuides: ImplementationGuideListItemModel[];

    public options = new ExportOptions();

    constructor(
        private implementationGuideService: ImplementationGuideService,
        private socketService: SocketService,
        private exportService: ExportService,
        private globals: Globals,
        private cookieService: CookieService,
        private configService: ConfigService) {

        this.options.implementationGuideId = this.cookieService.get(this.globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer);

        // Handle intermittent disconnects mid-export by notifying the server that we are currently exporting the given packageId
        this.socketService.onConnected.subscribe(() => {
            if (this.packageId) {
                this.socketService.notifyExporting(this.packageId);
            }
        });
    }

    public export() {
        this.socketOutput = '';
        this.message = 'Exporting...';

        this.cookieService.put(this.globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer, this.options.implementationGuideId);

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

    ngOnInit() {
        this.implementationGuideService.getImplementationGuides()
            .subscribe((results) => {
                this.implementationGuides = results;
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
