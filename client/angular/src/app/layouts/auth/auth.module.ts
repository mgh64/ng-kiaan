import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthService } from './auth.service';
import { AuthComponent } from './auth.component';

import { AppHeaderComponent } from './widgets/app-header';
import { AppFooterComponent } from './widgets/app-footer';
// import { MenuAsideComponent } from './widgets/menu-aside';
// import { ControlSidebarComponent } from './widgets/control-sidebar';
// import { MessagesBoxComponent } from './widgets/messages-box';
// import { NotificationBoxComponent } from './widgets/notification-box';
// import { TasksBoxComponent } from './widgets/tasks-box';
// import { UserBoxComponent } from './widgets/user-box';
// import { BreadcrumbComponent } from './widgets/breadcrumb';

let widgets = [
  // BreadcrumbComponent,
  AppHeaderComponent,
  AppFooterComponent,
  // MenuAsideComponent,
  // ControlSidebarComponent,
  // MessagesBoxComponent,
  // NotificationBoxComponent,
  // TasksBoxComponent,
  // UserBoxComponent
];

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule
  ],
  declarations: [
    AuthComponent,
    widgets
  ],
  providers: [AuthService]
})
export class AuthModule { }
