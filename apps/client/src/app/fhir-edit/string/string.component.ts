import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {NgModel} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

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
  @Input() isFormGroup = true;
  @Input() defaultValue = '';
  @Input() tooltipKey: string;
  @Input() tooltipPath: string;
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input() pattern: string | RegExp;
  @Input() patternMessage: string;
  @Input() label = true;
  @Input() alphanumeric = false;

  @ViewChild('formGroupModel', { static: true })
  private formGroupModel: NgModel;

  @ViewChild('model', { static: true })
  private model: NgModel;

  /**
   * Indicates that the value of the component should be remembered in cookies
   */
  @Input() cookieKey?: string;

  public changeEvent = new Subject();
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private cookieService: CookieService) {

    // Throttle how often this.change gets emitted so that it doesn't trigger for every single key press
    this.changeEvent.pipe(debounceTime(500))
      .subscribe(() => this.change.emit(this.value));
  }

  public changeValue(value: string) {
    if (value !== this.value) {
      this.value = this.alphanumeric ? value.replace(/[^a-zA-Z0-9]/gi, '') : value;
      this.changeEvent.next();
    }
  }

  public get value() {
    if (!this.parentObject[this.propertyName]) {
      return '';
    }

    return this.alphanumeric ?
      this.parentObject[this.propertyName].replace(/[^a-zA-Z0-9]/gi, '') :
      this.parentObject[this.propertyName];
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

    return true;
  }

  public set value(newValue: string) {
    newValue = this.alphanumeric && newValue ? newValue.replace(/[^a-zA-Z0-9]/gi, '') : newValue;
    if (!newValue && this.parentObject[this.propertyName]) {
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
    if (this.cookieKey) {
      this.value = this.cookieService.get(this.cookieKey);
    }
  }
}
