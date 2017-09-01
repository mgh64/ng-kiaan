import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(
    private _http: Http
  ) { }

  getTest() {
    // return this.http.get(`http://localhost:3000/bank_info`)
    //   .map((res: Response) => res.json())
    return this._http.get(`dashboard`)
      .map((res: Response) => res)
  }
}
