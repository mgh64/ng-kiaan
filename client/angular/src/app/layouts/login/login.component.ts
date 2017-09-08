import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(
    private LoginService: LoginService,
    private router: Router,
  ) {

  }
  // mybank = {};
  login() {
    // console.log()
    // this.LoginService.getUser().subscribe(data => this.mybank = data);
    // this.LoginService.getUser().subscribe(data => console.log(data));
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('username', 'mostafa.gh64@gmail.com');
    urlSearchParams.append('password', '640120');
    let body = urlSearchParams.toString();

    this.LoginService.authenticate(body).subscribe(
      Response => {
        let data: any = Response;
        if (data.auth == true) {
          // console.log('Auth is true');
          this.router.navigate(['home']);
        } else {
          console.error('درخواست غیر مجاز');
        }
      }
    )

  }

}
