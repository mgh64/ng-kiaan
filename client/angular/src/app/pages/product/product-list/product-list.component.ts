import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../product.service';
import { IProduct } from '../iproduct';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  pageTitle = 'Product List';
  errorMessage: string;
  listFilter: string;

  products: IProduct[];

  constructor(
    private ProductService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.listFilter = this.route.snapshot.queryParams['filterBy'] || '';

    this.ProductService.getProducts()
      .subscribe(products => this.products = products,
      error => this.errorMessage = <any>error);
  }
  // ngOnInit() {
  //   this.ProductService.getProducts().subscribe(data => console.log(data));
  // }

}
