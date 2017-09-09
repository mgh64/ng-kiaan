import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../login/auth.guard';

import { AuthComponent } from './auth.component';
import { PersonListComponent } from './pages/person/person-list/person-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    canActivate: [AuthGuard],
    path: '',
    component: AuthComponent,
    // pathMatch: 'full',
    children: [
      {
        canActivate: [AuthGuard],
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        canActivate: [AuthGuard],
        component: PersonListComponent,
        path: 'persons'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
