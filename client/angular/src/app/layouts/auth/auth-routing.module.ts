import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../login/auth.guard';

import { AuthComponent } from './auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PersonListComponent } from './pages/person/person-list/person-list.component';
import { PersonAddComponent } from './pages/person/person-add/person-add.component';

const routes: Routes = [
  {
    // canActivate: [AuthGuard],
    path: '',
    component: AuthComponent,
    // pathMatch: 'full',
    children: [
      {
        // canActivate: [AuthGuard],
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        // canActivate: [AuthGuard],
        component: PersonListComponent,
        path: 'persons'
      },
      {
        // canActivate: [AuthGuard],
        component: PersonAddComponent,
        path: 'persons/new'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
