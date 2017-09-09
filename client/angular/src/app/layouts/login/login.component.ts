import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(
    private AuthService: AuthService,
    private router: Router,
  ) {

  }
  // mybank = {};
  login() {
    // console.log()
    // this.LoginService.getUser().subscribe(data => this.mybank = data);
    // this.LoginService.getUser().subscribe(data => console.log(data));
    // let urlSearchParams = new URLSearchParams();
    // urlSearchParams.append('username', 'mostafa.gh64@gmail.com');
    // urlSearchParams.append('password', '640120');
    // let body = urlSearchParams.toString();

    this.AuthService.authenticate('mostafa.gh64@gmail.com', '640120').subscribe(
      Response => {
        // console.log(Response)
        const data: any = Response;
        if (data == true) {
          this.router.navigate(['/persons']);
        } else {
          console.error('درخواست غیر مجاز');
        }
      }
    );

  }

}
