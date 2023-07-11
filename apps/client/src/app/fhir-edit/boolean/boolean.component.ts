import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-fhir-boolean',
  templateUrl: './boolean.component.html',
  styleUrls: ['./boolean.component.css']
})
export class FhirBooleanComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() required = false;
  @Input() isFormGroup = true;
  @Input() defaultValue = false;
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;
  @Input() falseLabel = 'false';
  @Input() trueLabel = 'true';
  @Input() allowUndefined = false;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Indicates that the value of the component should be remembered in cookies
   */
  @Input() cookieKey?: string;

  constructor(private cookieService: CookieService) {
  }

  public get value(): boolean {
    if (!this.parentObject) {
      return;
    }
    return this.parentObject[this.propertyName];
  }

  public set value(newValue: boolean) {
    if (newValue !== true && newValue !== false && this.parentObject && this.parentObject.hasOwnProperty(this.propertyName)) {
      delete this.parentObject[this.propertyName];
      this.change.emit();

      if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
        this.cookieService.delete(this.cookieKey);
      }
    } else if (newValue === true || newValue === false) {
      this.parentObject[this.propertyName] = newValue;
      this.change.emit();

      if (this.cookieKey) {
        this.cookieService.set(this.cookieKey, newValue.toString());
      }
    }
  }

  ngOnInit() {
    if (this.parentObject && !this.parentObject.hasOwnProperty(this.propertyName) && this.required) {
      this.parentObject[this.propertyName] = this.allowUndefined ? undefined : false;
    }

    if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
      this.value = this.cookieService.get(this.cookieKey).toLowerCase() === 'true';
    }
  }
}
