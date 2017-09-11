import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonService } from './person.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [PersonService]
})
export class PersonModule { }
