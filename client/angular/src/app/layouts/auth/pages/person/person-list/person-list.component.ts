import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Iperson } from '../iperson';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  pageTitle = 'لیست اشخاص';

  private errorMessage: string;
  private persons: Iperson[];

  constructor(
    private _PersonService: PersonService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._PersonService.getPersons()
      .subscribe(
      persons => this.persons = persons,
      error => this.errorMessage = <any>error
      );
  }

}
