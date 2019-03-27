import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FhirService} from '../../shared/fhir.service';
import {Globals} from '../../globals';
import {CookieService} from 'angular2-cookie/core';

@Component({
    selector: 'app-tooltip-icon',
    templateUrl: './tooltip-icon.component.html',
    styleUrls: ['./tooltip-icon.component.css']
})
export class TooltipIconComponent implements OnInit {
    @Input() tooltipKey: string;
    @Input() tooltipPath: string;
    @Input() showAsAlert = false;
    @Input() alertTitle: string;

    public tooltip: string;
    public tooltipPlacement = 'top';
    public hidden = false;

    constructor(
        private fhirService: FhirService,
        private el: ElementRef,
        private cookieService: CookieService) {
    }

    public get cookieName(): string {
        return 'tooltip-' + (this.tooltipKey || this.tooltipPath);
    }

    public toggle() {
        this.hidden = !this.hidden;
        this.cookieService.put(this.cookieName, this.hidden.toString());
    }

    ngOnInit() {
        // If a cookie exists for the tooltip, use it to determine if it should be hidden
        const cookieValue = this.cookieService.get(this.cookieName);
        if (cookieValue) {
            this.hidden = cookieValue.toLowerCase() === 'true';
        }

        if (this.tooltipKey) {
            this.tooltip = Globals.tooltips[this.tooltipKey];
        } else if (this.tooltipPath) {
            this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
        }

        const bounds = this.el.nativeElement.getBoundingClientRect();

        if (bounds.left < 200) {
            this.tooltipPlacement = 'right';
        } else if (bounds.top < 250) {
            this.tooltipPlacement = 'bottom';
        }
    }
}
