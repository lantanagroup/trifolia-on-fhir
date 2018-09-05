import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {Globals} from '../globals';

@Component({
    selector: 'app-tooltip-icon',
    templateUrl: './tooltip-icon.component.html',
    styleUrls: ['./tooltip-icon.component.css']
})
export class TooltipIconComponent implements OnInit {
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;
    public tooltip: string;
    public tooltipPlacement = 'top';

    constructor(
        private fhirService: FhirService,
        private globals: Globals,
        private el: ElementRef) {
    }

    ngOnInit() {
        if (this.tooltipKey) {
            this.tooltip = this.globals.tooltips[this.tooltipKey];
        } else if (this.tooltipPath) {
            this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
        }

        const bounds = this.el.nativeElement.getBoundingClientRect();

        if (bounds.left < 200) {
            this.tooltipPlacement = 'right';
        } else if (bounds.top < 200) {
            this.tooltipPlacement = 'bottom';
        }
    }
}
