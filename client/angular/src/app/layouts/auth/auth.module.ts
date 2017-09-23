import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { AuthComponent } from './auth.component';
import { PersonModule } from './pages/person/person.module';

import { AppHeaderComponent } from '../../widgets/app-header';
import { AppFooterComponent } from '../../widgets/app-footer';
// import { BreadcrumbComponent } from './widgets/breadcrumb';
import { MenuAsideComponent } from '../../widgets/menu-aside';
// import { ControlSidebarComponent } from './widgets/control-sidebar';
// import { MessagesBoxComponent } from './widgets/messages-box';
// import { NotificationBoxComponent } from './widgets/notification-box';
// import { TasksBoxComponent } from './widgets/tasks-box';
import { UserBoxComponent } from '../../widgets/user-box';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { PersonListComponent } from './pages/person/person-list/person-list.component';
import { PersonAddComponent } from './pages/person/person-add/person-add.component'

import { CommentComponent } from './shared/comment/comment.component';
const widgets = [
  AppHeaderComponent,
  AppFooterComponent,
  // BreadcrumbComponent,
  MenuAsideComponent,
  // ControlSidebarComponent,
  // MessagesBoxComponent,
  // NotificationBoxComponent,
  // TasksBoxComponent,
  UserBoxComponent
];
const Person = [
  PersonListComponent,
  PersonAddComponent
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    PersonModule,

    AuthRoutingModule,
  ],
  declarations: [
    AuthComponent,
    widgets,
    Person,
    DashboardComponent,
    CommentComponent
  ],
  providers: []
})
export class AuthModule { }
