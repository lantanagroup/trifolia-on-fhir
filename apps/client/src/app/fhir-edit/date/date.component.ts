import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {CookieService} from 'angular2-cookie/core';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {pad} from '../../../../../../libs/tof-lib/src/lib/helper';

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
  @Input() allowTime = false;
  @Input() label? = true;
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Indicates that the value of the component should be remembered in cookies
   */
  @Input() cookieKey?: string;

  public Globals = Globals;
  public time: NgbTimeStruct;
  public date: NgbDateStruct;
  public tz: string;

  constructor(
    private cookieService: CookieService) {
  }

  public get dateModel() {
    return this.date;
  }

  public isValid() {
    if (this.required && !this.value) return false;
    if (!this.value) return true;

    const dateRegex = this.allowTime ?
      /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/g :
      /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$/g;
    return !!dateRegex.exec(this.value);
  }

  public set dateModel(date: NgbDateStruct) {
    this.date = date;

    if (date) {
      if (this.value && this.value.indexOf('T') > 0) {
        this.value = `${pad(date.year, 4)}-${pad(date.month, 2)}-${pad(date.day, 2)}` + this.value.substring(this.value.indexOf('T'));
      } else {
        this.value = `${pad(date.year, 4)}-${pad(date.month, 2)}-${pad(date.day, 2)}`;
      }
    }
  }

  public get timeModel() {
    return this.time;
  }

  public set timeModel(time: NgbTimeStruct) {
    this.time = time;
    this.setTimeFromModel();
  }

  public setTimeFromModel() {
    if (this.time) {
      if (!this.value) {
        this.value = new Date().toISOString().substring(0, 11) + `${pad(this.time.hour, 2)}:${pad(this.time.minute, 2)}:${pad(this.time.second, 2)}${this.tz}`;
      } else if (this.value.indexOf('T') < 0) {
        this.value += `T${pad(this.time.hour, 2)}:${pad(this.time.minute, 2)}:${pad(this.time.second, 2)}${this.tz}`;
      } else {
        this.value = this.value.substring(0, this.value.indexOf('T')) + `T${pad(this.time.hour, 2)}:${pad(this.time.minute, 2)}:${pad(this.time.second, 2)}${this.tz}`;
      }
    }
  }

  public get value(): string {
    if (!this.parentObject || !this.parentObject[this.propertyName]) {
      return '';
    }

    if (this.parentObject[this.propertyName] instanceof Date) {
      const theDate = <Date> this.parentObject[this.propertyName];
      return theDate.formatFhir();
    } else if (typeof this.parentObject[this.propertyName] === 'string') {
      return this.parentObject[this.propertyName];
    } else {
      console.error('Unexpected date type/value for DateComponent');
      return this.parentObject[this.propertyName];
    }
  }

  public set value(newValue: string) {
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
    this.change.emit();
  }

  public valueChanged() {
    this.initDate();
    this.initTime();
  }

  private initDate() {
    const dateTimeRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/g;
    const dateMatched = dateTimeRegex.exec(this.value);

    const yearText = dateMatched && dateMatched.length > 1 ? dateMatched[1] : null;
    const monthText = dateMatched && dateMatched.length > 5 ? dateMatched[5] : null;
    const dayText = dateMatched && dateMatched.length > 7 ? dateMatched[7] : null;

    this.date = {
      year: yearText ? parseInt(yearText, null) : null,
      month: monthText ? parseInt(monthText, null) : null,
      day: dayText ? parseInt(dayText, null) : null
    };
  }

  private initTime() {
    const defaultTzHours = new Date().getTimezoneOffset() / 60;
    const dateTimeRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/g;
    const timeRegex = /^(2[0-3]|[01][0-9])(:([0-5][0-9]))?(:([0-5][0-9]))?(\-[0-9]{2}:[0-9]{2})?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/g;
    const dateTimeMatched = dateTimeRegex.exec(this.value);

    if (!dateTimeMatched || dateTimeMatched.length < 9) {
      this.time = { hour: null, minute: null, second: null };
      this.tz = (defaultTzHours >= 0 ? '+' : '-') + pad(defaultTzHours, 2) + ':00';
      return;
    }

    const timeMatch = dateTimeMatched[8] ? timeRegex.exec(dateTimeMatched[8].substring(1)) : null;
    const hourText = timeMatch && timeMatch.length > 1 ? timeMatch[1] : null;
    const minuteText = timeMatch && timeMatch.length > 3 ? timeMatch[3] : null;
    const secondText = timeMatch && timeMatch.length > 5 ? timeMatch[5] : null;

    this.time = {
      hour: hourText ? parseInt(hourText, null) : null,
      minute: minuteText ? parseInt(minuteText, null) : null,
      second: secondText ? parseInt(secondText, null) : null
    };

    this.tz = timeMatch && timeMatch.length > 7 ? timeMatch[7] : (defaultTzHours >= 0 ? '+' : '-') + pad(defaultTzHours, 2) + ':00';
  }

  ngOnInit() {
    if (this.cookieKey && this.cookieService.get(this.cookieKey)) {
      this.value = this.cookieService.get(this.cookieKey);
    }

    this.initDate();
    this.initTime();
  }
}
