import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { PersonService } from './person.service';

import { PersonListComponent } from './person-list/person-list.component';
import { PersonAddComponent } from './person-add/person-add.component';

import { FirstNameComponent } from '../shared/first-name/first-name.component';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  declarations: [
    PersonListComponent,
    PersonAddComponent,
    FirstNameComponent
  ],
  providers: [PersonService]
})
export class PersonModule { }
