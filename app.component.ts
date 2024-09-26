import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { WorkingComponent } from './working/working.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, MatCheckboxModule, WorkingComponent, MultiSelectComponent, FormsModule, ReactiveFormsModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
  	title = 'MegaForm';

	smFormControl = new FormControl([{ name: '', value: 1, checked: true }]);

	ngOnInit() {
		this.smFormControl.valueChanges.subscribe(x => console.log(x))
	}

	output: { name: string, value: number, checked: boolean }[] = [];

	data2 = Array.from({ length: 50000 }, (_, i) => {
		return {
			name: 'Nazwa ' + (i + 1),
			value: i,
			checked: false
		}
	});

	data = [
		{
			name: 'Nazwa 1',
			value: 1
		},
		{
			name: 'Nazwa 12',
			value: 12
		},
		{
			name: 'Nazwa 13',
			value: 13
		},
		{
			name: 'Nazwa 14',
			value: 14
		},
		{
			name: 'Nazwa 15',
			value: 15
		},
		{
			name: 'Nazwa 16',
			value: 16
		},
		{
			name: 'Nazwa 17',
			value: 17
		},
		{
			name: 'Nazwa 18',
			value: 18
		},
		{
			name: 'Nazwa 19',
			value: 19
		},
		{
			name: 'Nazwa 20',
			value: 20
		},
		{
			name: 'Nazwa 21',
			value: 21
		},
		{
			name: 'Nazwa 22',
			value: 22
		},
		{
			name: 'Nazwa 23',
			value: 23
		},
		{
			name: 'Nazwa 24',
			value: 24
		},
		{
			name: 'Nazwa 25',
			value: 25
		},
		{
			name: 'Nazwa 26',
			value: 26
		},
		{
			name: 'Nazwa 27',
			value: 27
		},
		{
			name: 'Nazwa 28',
			value: 28
		},
		{
			name: 'Nazwa 29',
			value: 29
		},
	]
}
