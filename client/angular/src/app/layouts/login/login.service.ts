import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
// import {IUser} from './user'
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// import { URLSearchParams } from "@angular/http"

@Injectable()
export class LoginService {

  constructor(
    private http: Http,
    private router: Router,
  ) { }

  authenticate(data) {
    let url = '/';
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    // let encoded_data = JSON.stringify({ data });
    // console.log(encoded_data);
    return this.http.post(url, data, options)
      .map((res: Response) => res.json() || {})
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  // getUser() {
  //   return this.http.get(`/persons_info`)
  //     .map((res: Response) => res.json());
  // }

}
