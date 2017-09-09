import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule
  ],
  declarations: [],
  providers: [AuthService, AuthGuard]
})
export class LoginModule { }
