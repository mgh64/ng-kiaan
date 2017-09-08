import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { PersonListComponent } from '../../pages/person/person-list/person-list.component';

const routes: Routes = [
  {
    path: 'home',
    component: AuthComponent,
    children: [
      {
        path: 'persons',
        component: PersonListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
