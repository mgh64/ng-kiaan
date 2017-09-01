import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../product.service';
import { IProduct } from '../iproduct';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle = 'Product Detail';
  product: IProduct;
  errorMessage: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let id = +this.route.snapshot.params['id'];
    // console.log(id);
    this.getProduct(id);
  }

  getProduct(id: number) {
    this.productService.getProduct(id).subscribe(
      product => this.product = product,
      error => this.errorMessage = <any>error);
  }
}
