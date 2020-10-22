import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FhirService} from '../../shared/fhir.service';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {CookieService} from 'angular2-cookie/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-tooltip-icon',
  templateUrl: './tooltip-icon.component.html',
  styleUrls: ['./tooltip-icon.component.css']
})
export class TooltipIconComponent implements OnInit {
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;
  @Input() helpLocation: string;
  @Input() showAsAlert = false;
  @Input() showAsExclamation = false;
  @Input() alertTitle: string;

  public tooltip: string;
  public tooltipPlacement = 'top';
  public hidden = false;

  constructor(
    private fhirService: FhirService,
    private el: ElementRef,
    private cookieService: CookieService,
    private httpService: HttpClient) {
  }

  public get cookieName(): string {
    return 'tooltip-' + (this.tooltipKey || this.tooltipPath);
  }

  public toggle() {
    this.hidden = !this.hidden;
    this.cookieService.put(this.cookieName, this.hidden.toString());
  }

  async ngOnInit() {
    // If a cookie exists for the tooltip, use it to determine if it should be hidden
    const cookieValue = this.cookieService.get(this.cookieName);
    if (cookieValue) {
      this.hidden = cookieValue.toLowerCase() === 'true';
    }

    if (this.tooltipKey) {
      this.tooltip = Globals.tooltips[this.tooltipKey];
    } else if (this.tooltipPath) {
      this.tooltip = this.fhirService.getFhirTooltip(this.tooltipPath);
    } else if (this.helpLocation) {
      this.tooltip = `See <a href="${this.helpLocation}" target="_new">this</a> help documentation for more info.`;
    }

    const bounds = this.el.nativeElement.getBoundingClientRect();

    if (bounds.left < 200) {
      this.tooltipPlacement = 'right';
    } else if (bounds.top < 250) {
      this.tooltipPlacement = 'bottom';
    }
  }
}
