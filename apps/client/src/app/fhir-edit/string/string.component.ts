import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgModel} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-fhir-string',
  templateUrl: './string.component.html',
  styleUrls: ['./string.component.css']
})
export class FhirStringComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title: string;
  @Input() required = false;
  @Input() requiredMessage = 'This field is required.';
  @Input() whiteSpaceMessage = 'This field should not start or end with a white-space.';
  @Input() isFormGroup = true;
  @Input() defaultValue = '';
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input() pattern: string | RegExp;
  @Input() patternMessage: string;
  @Input() label = true;

  @ViewChild('formGroupModel', { static: true })
  private formGroupModel: NgModel;

  @ViewChild('model', { static: true })
  private model: NgModel;

  /**
   * Indicates that the value of the component should be remembered in cookies
   */
  @Input() cookieKey?: string;

  public changeEvent = new Subject<void>();
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private cookieService: CookieService) {

    // Throttle how often this.change gets emitted so that it doesn't trigger for every single key press
    this.changeEvent.pipe(debounceTime(500))
      .subscribe(() => this.change.emit(this.value));
  }

  public changeValue(value: string) {
    if (value !== this.value) {
      this.value = value;
      this.changeEvent.next();
    }
  }

  public get value() {
    if (!this.parentObject[this.propertyName]) {
      return '';
    }

    return this.parentObject[this.propertyName];
  }

  public get isValid() {
    if (this.required && !this.value) {
      return false;
    }
    if (this.isFormGroup && this.formGroupModel && this.formGroupModel.invalid) {
      return false;
    } else if (!this.isFormGroup && this.model && this.model.invalid) {
      return false;
    }
    return !this.whiteSpace();
  }

  public whiteSpace() {
    return this.value && this.value !== this.value.trim();
  }

  public set value(newValue: string) {
    if (!newValue && this.parentObject[this.propertyName]) {
      delete this.parentObject[this.propertyName];

      if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
        this.cookieService.delete(this.cookieKey);
      }
    } else if (newValue) {
      this.parentObject[this.propertyName] = newValue;

      if (this.cookieKey) {
        this.cookieService.set(this.cookieKey, newValue);
      }
    }
  }

  ngOnInit() {
    if (this.cookieKey) {
      this.value = this.cookieService.get(this.cookieKey);
    }
  }
}
