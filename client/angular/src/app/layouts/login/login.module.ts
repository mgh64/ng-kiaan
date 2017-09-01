import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginService } from './login.service';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule
  ],
  declarations: [],
  providers: [LoginService]
})
export class LoginModule { }
