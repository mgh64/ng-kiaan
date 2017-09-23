import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Iperson } from './iperson'

@Injectable()
export class PersonService {
  //
  private person_type = [{
    title: "حقیقی",
    value: "person"
  }, {
    title: "شرکت",
    value: "company"
  }, {
    title: "سهامدار",
    value: "shareholder"
  }];
  //
  private remaining_type = [
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
  ];
  //
  constructor(
    private _http: Http,
  ) { }
  //
  getPersons(): Observable<Iperson[]> {
    return this._http.get("/_persons")
      .map(this.extractData)
      .do(data => {
        var person_type_map = {};
        this.person_type.forEach(function(r) {
          person_type_map[r.value] = r.title;
        });
        data.forEach(function(r) {
          r.person_id.type = person_type_map[r.person_id.type];
          //
          if (Number(r.sum) === 0) {
            r.mahiat = 'بی حساب';
          } else if (Number(r.sum) >= 0) {
            r.mahiat = 'بدهکار';
          } else if (Number(r.sum) <= 0) {
            r.mahiat = 'بستانکار';
          }
        })
      })
      // .do(data => console.log('getPersons: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }


  getPersonGroupList(): Observable<any> {
    return this._http.get("/g_persons")
      .map(this.extractData)
      .do(data => {
        this.getPersonGroupList = data;
      })
      .catch(this.handleError)
  }

  getPersonType() {
    return this.person_type;
  }

  getRemainingType() {
    return this.remaining_type
  }

  private extractData(response: Response) {
    let body = response.json();
    return body.data || {};
  }

  private handleError(error: Response): Observable<any> {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
