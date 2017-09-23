import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToasterModule } from 'angular2-toaster';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginModule } from './layouts/login/login.module';
import { AuthModule } from './layouts/auth/auth.module';
// import { PersonModule } from './layouts/auth/pages/person/person.module';

/// TODO: remove this import
import { ProductModule } from './pages/product/product.module';

import { LoginComponent } from './layouts/login/login.component';
import { PageNotFound404Component } from './pages/page-not-found-404/page-not-found-404.component';

const pages = [
  LoginComponent,
  PageNotFound404Component
];

@NgModule({
  declarations: [
    AppComponent,
    ...pages
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ToasterModule,

    LoginModule,
    AuthModule,
    // PersonModule,
    //TODO: remove this item
    ProductModule,

    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
