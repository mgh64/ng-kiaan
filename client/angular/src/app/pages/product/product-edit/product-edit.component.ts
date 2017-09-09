import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../product.service';
import { IProduct } from '../iproduct';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  product: IProduct;
  errorMessage: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        const id = +params['id'];
        this.getProduct(id);
      }
    );
  }

  getProduct(id: number): void {
    this.productService.getProduct(id)
      .subscribe(
      (product: IProduct) => this.onProductRetrieved(product),
      (error: any) => this.errorMessage = <any>error
      );
  }

  onProductRetrieved(product: IProduct): void {
    this.product = product;

    if (this.product.id === 0) {
      this.pageTitle = 'Add Product';
    } else {
      this.pageTitle = `Edit Product: ${this.product.productName}`;
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id)
          .subscribe(
          () => this.onSaveComplete(`${this.product.productName} was deleted`),
          (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveProduct(): void {
    if (true === true) {
      this.productService.saveProduct(this.product)
        .subscribe(
        () => this.onSaveComplete(`${this.product.productName} was saved`),
        (error: any) => this.errorMessage = <any>error
        );
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      // TODO: show msg
    }

    // Navigate back to the product list
    this.router.navigate(['/products']);
  }

}
