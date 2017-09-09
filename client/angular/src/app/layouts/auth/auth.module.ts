import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthComponent } from './auth.component';
import { PersonListComponent } from "../../pages/person/person-list/person-list.component";

import { AppHeaderComponent } from '../../widgets/app-header';
import { AppFooterComponent } from '../../widgets/app-footer';
// import { BreadcrumbComponent } from './widgets/breadcrumb';
import { MenuAsideComponent } from '../../widgets/menu-aside';
// import { ControlSidebarComponent } from './widgets/control-sidebar';
// import { MessagesBoxComponent } from './widgets/messages-box';
// import { NotificationBoxComponent } from './widgets/notification-box';
// import { TasksBoxComponent } from './widgets/tasks-box';
import { UserBoxComponent } from '../../widgets/user-box';

let widgets = [
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

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule
  ],
  declarations: [
    AuthComponent,
    PersonListComponent,
    widgets
  ],
  providers: []
})
export class AuthModule { }
