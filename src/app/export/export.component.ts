import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImplementationGuideListItemModel} from '../models/implementation-guide-list-item-model';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {saveAs} from 'file-saver';
import {ExportOptions, ExportService} from '../services/export.service';
import {ExportFormats} from '../models/export-formats.enum';
import * as _ from 'underscore';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit, OnDestroy {
    public message: string;
    private socket;
    public socketOutput = '';
    private packageId;
    public implementationGuides: ImplementationGuideListItemModel[];

    public options = new ExportOptions();

    constructor(
        private implementationGuideService: ImplementationGuideService,
        private exportService: ExportService) {
    }

    public export() {
        this.socketOutput = '';

        this.exportService.export(this.options)
            .subscribe((results: any) => {
                if (this.options.exportFormat === ExportFormats.Bundle) {
                    const ig = _.find(this.implementationGuides, (next) => next.id === this.options.implementationGuideId);
                    const igName = ig.name.replace(/\s/g, '_');
                    const extension = (this.options.responseFormat === 'application/xml' ? '.xml' : '.json');

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

        this.socket = io(location.origin);

        this.socket.on('message', (data) => {
            if (data.packageId === this.packageId) {
                this.socketOutput += data.message;

                if (!data.message.endsWith('\n')) {
                    this.socketOutput += '\r\n';
                }

                if (data.status === 'complete') {
                    const ig = _.find(this.implementationGuides, (next) => next.id === this.options.implementationGuideId);
                    const igName = ig.name.replace(/\s/g, '_');

                    this.exportService.getPackage(this.packageId)
                        .subscribe((results: any) => {
                            saveAs(results.body, igName + '.zip');
                        });
                }
            }
        });
    }

    ngOnDestroy() {
        this.socket.disconnect();
    }
}
