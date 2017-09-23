import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-first-name',
  templateUrl: './first-name.component.html',
  styleUrls: ['./first-name.component.css']
})
export class FirstNameComponent {
  @Input() sharedVar: string;
  @Output() sharedVarChange = new EventEmitter();
  change(newValue) {
    console.log('newvalue', newValue)
    this.sharedVar = newValue;
    this.sharedVarChange.emit(newValue);
  }
}
