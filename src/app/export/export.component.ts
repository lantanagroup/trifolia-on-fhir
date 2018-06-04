import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImplementationGuideListItemModel} from '../models/implementation-guide-list-item-model';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {saveAs} from 'file-saver';
import {ExportService} from '../services/export.service';
import {ExportFormats} from '../models/export-formats.enum';
import * as _ from 'underscore';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.css'],
    providers: [ImplementationGuideService, ExportService]
})
export class ExportComponent implements OnInit, OnDestroy {
    public implementationGuides: ImplementationGuideListItemModel[];
    public implementationGuideId: number;
    public exportFormat = ExportFormats.Bundle;
    public responseFormat = 'application/json';
    public message: string;
    private socket;
    public socketOutput = '';
    private packageId;

    constructor(
        private implementationGuideService: ImplementationGuideService,
        private exportService: ExportService) {
    }

    public export() {
        this.socketOutput = '';

        this.exportService.export(this.implementationGuideId, this.exportFormat, this.responseFormat)
            .subscribe((results: any) => {
                if (this.exportFormat === ExportFormats.Bundle) {
                    const ig = _.find(this.implementationGuides, (next) => next.id === this.implementationGuideId);
                    const igName = ig.name.replace(/\s/g, '_');
                    const extension = (this.responseFormat === 'application/xml' ? '.xml' : '.json');

                    saveAs(results.body, igName + extension);
                } else if (this.exportFormat === ExportFormats.HTML) {
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
            }

            if (data.status === 'complete') {
                const ig = _.find(this.implementationGuides, (next) => next.id === this.implementationGuideId);
                const igName = ig.name.replace(/\s/g, '_');

                this.exportService.getPackage(this.packageId)
                    .subscribe((results: any) => {
                        saveAs(results.body, igName + '.zip');
                    });
            }
        });
    }

    ngOnDestroy() {
        this.socket.disconnect();
    }
}
