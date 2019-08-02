import {Component, Input, OnInit} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-fhir-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class FhirDateComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() required = false;
  @Input() isFormGroup = true;
  @Input() defaultValue = '';
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;

  /**
   * Indicates that the value of the component should be remembered in cookies
   */
  @Input() cookieKey?: string;

  public Globals = Globals;

  constructor(
    private cookieService: CookieService) {
  }

  public get value(): any {
    if (!this.parentObject) {
      return;
    }

    return this.parentObject[this.propertyName];
  }

  public set value(newValue: any) {
    if (!newValue && this.parentObject && this.parentObject.hasOwnProperty(this.propertyName)) {
      delete this.parentObject[this.propertyName];

      if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
        this.cookieService.remove(this.cookieKey);
      }
    } else if (newValue) {
      this.parentObject[this.propertyName] = newValue;

      if (this.cookieKey) {
        this.cookieService.put(this.cookieKey, newValue);
      }
    }
  }

  ngOnInit() {
    if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
      this.value = this.cookieService.get(this.cookieKey);
    }
  }
}
