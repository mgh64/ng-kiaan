import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductListComponent
      },
      {
        path: ':id',
        component: ProductDetailComponent
      },
      {
        path: ':id/edit',
        component: ProductEditComponent
      }
    ]
  }
];

// const routes: Routes = [
//   { path: 'products', component: ProductListComponent },
//   { path: 'products/:id', component: ProductDetailComponent },
//   { path: 'products/:id/edit', component: ProductEditComponent }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
