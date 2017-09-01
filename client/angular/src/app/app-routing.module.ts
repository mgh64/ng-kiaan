import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { LoginComponent } from './layouts/login/login.component';

import { PageNotFound404Component } from './pages/page-not-found-404/page-not-found-404.component';

const routes: Routes = [

  // {
  //   component: LayoutsAuthComponent,
  //   path: '',
  //   canActivate: [CanActivateGuard],
  //   children: [
  //     {
  //       canActivate: [CanActivateGuard],
  //       component: HomeComponent,
  //       path: 'home'
  //     },
  //     {
  //       canActivate: [CanActivateGuard],
  //       component: PageNumComponent,
  //       path: 'page/:id'
  //     },
  //     {
  //       canActivate: [CanActivateGuard],
  //       component: ClientComponent,
  //       path: 'client'
  //     }
  //   ]
  // },

  // {
  //   path: 'dashboard',
  //   // pathMatch: 'full',
  //   component: DashboardComponent
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
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
