import { FocusMonitor } from '@angular/cdk/a11y';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { isIdentifier } from '@angular/compiler';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { BehaviorSubject, delay, filter, map, merge, Observable, startWith, tap } from 'rxjs';

@Component({
	selector: 'app-multi-select',
	standalone: true,
	imports: [FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatAutocompleteModule,
		ReactiveFormsModule,
		AsyncPipe,
		MatCheckboxModule,
		ScrollingModule,
		NgFor,
		NgIf,
		MatIconModule
	],
	templateUrl: './multi-select.component.html',
	styleUrl: './multi-select.component.scss',
	host: {
		'[style.--global-width]': 'width'
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: MultiSelectComponent,
			multi: true
		}
	]
})
export class MultiSelectComponent implements ControlValueAccessor {
	@Input() width = 150;
	@Input() defaultlabel = 'Wyszukiwanie';
	label = this.defaultlabel;
	@Input() selectedOptionsLabel = 'Wybrane opcje...';
	@Input() placeholder = 'Wyszukaj';
	@Input() data: { name: string, value: number, checked: boolean }[] = [];
	searchFormControl = new FormControl('');
	filteredOptions: Observable<{ name: string, value: number, checked: boolean, index: number }[]>;
	selectedOptions: { name: string, value: number, checked: boolean, index: number }[] = [];

	@ViewChild(CdkVirtualScrollViewport, { static: false }) cdkVirtualScrollViewPort!: CdkVirtualScrollViewport;
	@ViewChild(MatInput, { read: ElementRef, static: true }) private inputEl: ElementRef | null = null;

	filterString: string | null = '';

	refresh$ = new BehaviorSubject<string | null>('');

	disabled = false;

	constructor(private focusMonitor: FocusMonitor) {
		this.filteredOptions = merge(this.searchFormControl.valueChanges, this.refresh$).pipe(
			startWith(''),
			map(value => {
				this.filterString = value;
				const filterValue = (value || '').toLowerCase();
				return this.data.map((v, i) => ({...v, index: i})).filter(v => v.name.toLowerCase().includes(filterValue));
			}),
			tap(x => console.log(x))
		);
	}

	ngOnInit() {
		this.focusMonitor.monitor(this.inputEl!).pipe(
			//filter(focused => !!focused),
			map(focused => !!focused),
			delay(100)
		).subscribe(focused  => {
			console.log('focused', focused );

			if (focused) {
				this.label = this.defaultlabel
			} else {
				if (this.selectedOptions.length === 0) {
					this.label = this.defaultlabel
				} else {
					this.label = this.selectedOptionsAsString()
				}
			}

			//this.label = focused && this.selectedOptions.length === 0 ? this.defaultlabel : this.selectedOptionsAsString();
		});
	}	

	onChange: (value: { name: string, value: number, checked: boolean }[]) => void = () => {};
	onTouched: () => void = () => {};

	writeValue(value: { name: string, value: number, checked: boolean }[]): void {
		if (value === null) return;

		this.selectedOptions = value
			.map(v => {	
				const index = this.data.findIndex(x => x.value = v.value);
				if (index === -1) return null;

				this.data[index].checked = v.checked;
				const d = this.data[index];
				return { ...d, index }
			})
			.filter((x): x is { name: string, value: number, checked: boolean, index: number } => x !== null);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	toggle(option: { name: string, value: number, checked: boolean, index: number }): void {
		option.checked = !option.checked;
		if (option.checked) {
			this.selectedOptions.push(option);
		} else {
			this.selectedOptions = this.selectedOptions.filter(o => o.index !== option.index);
		}

		this.selectedOptions.sort((a, b) => a.index - b.index);
		this.data[option.index].checked = option.checked;
		this.refresh$.next(this.filterString);

		this.onChange(this.selectedOptions);
	}

	clearSelected(event: MouseEvent, option: { name: string, value: number, checked: boolean, index: number }): void {
		event.stopPropagation();
		this.toggle(option);
	}

	clearAll(): void {
		this.selectedOptions = [];
		this.data.forEach(d => d.checked = false);
		this.searchFormControl.setValue('');

		this.onChange(this.selectedOptions);
	}

	scrollMoveToTop(): void {
		this.cdkVirtualScrollViewPort.scrollToIndex(0);
      	this.cdkVirtualScrollViewPort.checkViewportSize();
	}

	//bez tego virtual scroll błędnie ogrania checki
	trackOption(index: number, option: { name: string, value: number, checked: boolean, index: number }): number | undefined {
        return option ? option.index : undefined;
    }

	private selectedOptionsAsString(): string {
		return this.selectedOptions.reduce((p, c) => `${p} ${c.name}`, '');
	}
}

type OnChangeFn<T> = (value: T) => void;
type OnTouchFn = () => void;

// @HostListener('focusout') onFocusOut() {
// 	this.onTouch();
// }
