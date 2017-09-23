import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PersonService } from './person.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [],
  providers: [PersonService]
})
export class PersonModule { }
