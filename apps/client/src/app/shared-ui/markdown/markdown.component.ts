import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as SimpleMDE from 'simplemde';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

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
export class MarkdownComponent extends NgModelBase implements AfterContentChecked, AfterViewInit, OnDestroy, OnChanges {
    @ViewChild('simplemde') textarea: ElementRef;
    @Input() disabled = false;

    private isVisible = false;
    private simplemde: SimpleMDE;
    private tmpValue = null;

    constructor() {
        super();
    }

    /**
     * Replaces the non-ascii dash character with the ascii dash character
     * Removes any remaining non-ascii characters
     * @param value {string} The value to fix/replace/remove
     */
    private getFixedValue(value: string) {
        if (!value) {
            return value;
        }

        return value
            .replace(/–/g, '-')
            .replace(/[^\x00-\x7F]/g, '');
    }

    writeValue(v: any) {
        if (v !== this._innerValue) {
            this._innerValue = v;

            if (this.simplemde) {
                if (this.value === undefined) {
                    this.simplemde.value('');
                } else {
                    const fixedValue = this.getFixedValue(this.value);
                    this.simplemde.value(fixedValue);
                }
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
            const fixedValue = this.getFixedValue(this.tmpValue);
            this.simplemde.value(fixedValue);
            this.tmpValue = null;
        }

        this.simplemde.codemirror.on('change', () => {
            if (this.value === undefined && !this.simplemde.value()) {
                return;
            }

            const value = this.simplemde.value();
            const fixedValue = this.getFixedValue(value);

            if (value !== fixedValue) {
                this.simplemde.value(fixedValue);
            }

            this.value = fixedValue;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.simplemde) {
            return;
        }

        if (changes['disabled'].previousValue !== changes['disabled'].currentValue) {
            this.simplemde.codemirror.setOption('disableInput', changes['disabled'].currentValue);
        }
    }

    ngOnDestroy() {
        this.simplemde = null;
    }

    ngAfterContentChecked() {
      if (!this.isVisible && this.textarea.nativeElement.offsetParent != null) {
        this.isVisible = true;
        this.simplemde.codemirror.refresh();
      } else if (this.isVisible && this.textarea.nativeElement.offsetParent == null) {
        this.isVisible = false;
      }
    }
}
