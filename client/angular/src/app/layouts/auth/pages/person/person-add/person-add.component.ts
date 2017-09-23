import { Component, OnInit } from '@angular/core';

import { Person } from './person';
import { FirstNameComponent } from '../../shared/first-name/first-name.component';

@Component({
  selector: 'app-person-add',
  templateUrl: './person-add.component.html',
  styleUrls: ['./person-add.component.css']
})
export class PersonAddComponent implements OnInit {
  sharedVarParent ='hello';

  private person_type: any;
  private first_remaining_type: any;

  // model = new Person();

  constructor() {
    this.person_type = [
      {
        title: "حقیقی",
        value: "person"
      }, {
        title: "شرکت",
        value: "company"
      }, {
        title: "سهامدار",
        value: "shareholder"
      }
    ];
    this.first_remaining_type = [
      {
        title: "بی حساب",
        value: "incalculable"
      },
      {
        title: "بدهکار",
        value: "debtor"
      },
      {
        title: "بستانکار",
        value: "creditor"
      }
    ]
  }

  ngOnInit() {
  }

  // getModel() {
  //   console.log(this.model);
  // }
}
