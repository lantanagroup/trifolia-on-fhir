import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, forwardRef} from '@angular/core';
import * as SimpleMDE from 'simplemde';
import {ControlValueAccessor} from '@angular/forms';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

const MARKDOWN_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MarkdownComponent),
    multi: true
}

export class NgModelBase implements ControlValueAccessor {
    public onTouchedCallback: () => {};
    public onChangeCallback: (_: any) => {};
    public _innerValue: any;

    set value(v: any) {
        if (v !== this._innerValue) {
            this._innerValue = v;
            this.onChangeCallback(v);
        }
    }

    get value(): any {
        return this._innerValue;
    }

    writeValue(v: any) {
        if (v !== this._innerValue) {
            this._innerValue = v;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css'],
  providers: [MARKDOWN_CONTROL_VALUE_ACCESSOR]
})
export class MarkdownComponent extends NgModelBase implements AfterViewInit, OnDestroy {
  @ViewChild('simplemde') textarea: ElementRef;

  private simplemde: SimpleMDE;
  private tmpValue = null;

  constructor() {
    super();
  }

  writeValue(v: any) {
    if (v !== this._innerValue) {
      this._innerValue = v;

      if (this.simplemde && this.value != null) {
        this.simplemde.value(this.value);
      }

      if (!this.simplemde) {
        this.tmpValue = this.value;
      }
    }
  }

  ngAfterViewInit() {
    const config = {
      element: this.textarea.nativeElement
    };
    this.simplemde = new SimpleMDE(config);

    if (this.tmpValue) {
      this.simplemde.value(this.tmpValue);
      this.tmpValue = null;
    }

    this.simplemde.codemirror.on('change', () => {
      this.value = this.simplemde.value();
    });
  }

  ngOnDestroy() {
    this.simplemde = null;
  }
}