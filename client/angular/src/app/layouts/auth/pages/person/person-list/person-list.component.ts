import { Component, OnInit } from '@angular/core';

import { IPersonList } from './person-list';
import { PersonService } from '../person.service';


@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {

  public filter: string = '';

  pageTitle = 'لیست اشخاص';
  p: number = 1;
  total: number;
  loading: boolean;

  private errorMessage: string;
  private persons: IPersonList[];

  constructor(
    private _PersonService: PersonService,
  ) { }

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number) {
    this.loading = true;

    const perPage = 7;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    this._PersonService.getPersons()
      .subscribe(
      persons => {
        let mydata: IPersonList[];
        mydata = persons;
        this.total = mydata.length;
        this.p = page;
        this.loading = false;
        this.persons = mydata.slice(start, end);
      });
  }


}
