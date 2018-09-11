import {
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
export class MarkdownComponent extends NgModelBase implements AfterViewInit, OnDestroy, OnChanges {
    @ViewChild('simplemde') textarea: ElementRef;
    @Input() disabled = false;

    private simplemde: SimpleMDE;
    private tmpValue = null;

    constructor() {
        super();
    }

    writeValue(v: any) {
        if (v !== this._innerValue) {
            this._innerValue = v;

            if (this.simplemde) {
                if (this.value === undefined) {
                    this.simplemde.value('');
                } else {
                    this.simplemde.value(this.value);
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
            this.simplemde.value(this.tmpValue);
            this.tmpValue = null;
        }

        this.simplemde.codemirror.on('change', () => {
            if (this.value === undefined && !this.simplemde.value()) {
                return;
            }

            this.value = this.simplemde.value();
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
}