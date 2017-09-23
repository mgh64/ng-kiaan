import { Component, OnInit } from '@angular/core';

import { PersonService } from '../person.service';
import { Person } from './person';

@Component({
  selector: 'app-person-add',
  templateUrl: './person-add.component.html',
  styleUrls: ['./person-add.component.css']
})
export class PersonAddComponent implements OnInit {
  model = new Person();

  private personType: any;
  private personGroupType: any;
  private firstRemainingType: any;
  //
  constructor(
    private _PersonService: PersonService
  ) { }

  ngOnInit() {
    this.personType = this._PersonService.getPersonType();
    this.firstRemainingType = this._PersonService.getRemainingType();
    //
    this._PersonService.getPersonGroupList()
      .subscribe(personGroupType => {
        this.personGroupType = personGroupType;
      })
  }
  //
}
