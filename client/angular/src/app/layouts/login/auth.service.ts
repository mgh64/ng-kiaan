import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  auth: boolean;

  constructor(
    private http: Http,
    private router: Router
  ) { }

  isLoggedIn(): boolean {
    return this.auth;
  }

  authenticate(username: string, password: string): Observable<boolean> {
    let url = '/';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify({ username: username, password: password }), options)
      .map((res: Response) => {
        this.auth = res.json().auth;
        return this.auth;
      })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  logout() {
    this.auth = false;
  }

}
