import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AuthGuard } from "./layouts/login/auth.guard";
// import { AuthComponent } from './layouts/auth/auth.component';

import { PageNotFound404Component } from './pages/page-not-found-404/page-not-found-404.component';

import { LoginComponent } from './layouts/login/login.component';

// import { PersonListComponent } from './pages/person/person-list/person-list.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [

  // not logged routes
  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // },
  {
    component: LoginComponent,
    path: 'login'
  },
  {
    path: '**',
    component: PageNotFound404Component
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
