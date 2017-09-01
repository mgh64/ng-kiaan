import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster';
// import {MyToaster} from '../../../shared/my-toaster';

import { LoginService } from './login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // template: `
  // <div>
  //   <button (click)="loadUser()">Load banks</button>
  //   {{ mybank | json }}
  // </div>
  // `,
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  // private auth: any
  constructor(
    private LoginService: LoginService,
    private router: Router,
    private toasterService: ToasterService
  ) {
    this.toasterService = toasterService;
  }
  mybank = {};

  login() {
    // console.log()
    // this.LoginService.getUser().subscribe(data => this.mybank = data);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('username', 'mostafa.gh64@gmail.com');
    urlSearchParams.append('password', '640120');
    let body = urlSearchParams.toString();

    this.LoginService.sendData(body).subscribe(
      Response => {
        // console.log(Response);
        // this.doneSaving = true;
        let data: any = Response;
        if (data.auth == true) {
          console.log('Auth is True');
          this.router.navigate(['auth']);
          // this.dataStructure.postOrPut = true;
        } else {
          console.error('درخواست غیر مجاز');
        }
      }
      // error => errorMessage = <any>error
    )

    // this.LoginService.authenticate();
    // this.LoginService.getUser().subscribe(data => console.log(data));
    // this.router.navigate(['dashboard']);
  }

  public toasterconfig: ToasterConfig =
  new ToasterConfig({
    positionClass: "toast-bottom-left",
    timeout: 5000,
    animation: 'fadeOut',
    limit: 5
  });
  //
  popToast() {
    this.toasterService.pop('success', 'عنوان', 'بدنه');
  }
}
