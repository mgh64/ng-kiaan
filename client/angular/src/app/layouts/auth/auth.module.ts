import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

import { PersonModule } from './pages/person/person.module';

import { AuthComponent } from './auth.component';

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
// import { FirstNameComponent } from './pages/shared/first-name/first-name.component';

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

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PersonModule,

    AuthRoutingModule,
  ],
  declarations: [
    AuthComponent,
    widgets,
    DashboardComponent
    // FirstNameComponent
  ],
  providers: []
})
export class AuthModule { }
