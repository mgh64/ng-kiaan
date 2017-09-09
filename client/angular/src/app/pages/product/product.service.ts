import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IProduct } from './iproduct';

@Injectable()
export class ProductService {

  private baseUrl = `http://localhost:3000/bank_info`;

  constructor(
    private http: Http
  ) { }

  getProducts() {
    return this.http.get(this.baseUrl)
      .map((res: Response) => res.json());
  }

  getProduct(id: number): Observable<IProduct> {
    if (id === 0) {
      return Observable.of(this.initializeProduct());
    };
    const url = `${this.baseUrl}/${id}`;
    return this.http.get(url)
      .map(this.extractData)
      .do(data => console.log('getProduct: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  deleteProduct(id: number): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, options)
      .do(data => console.log('deleteProduct: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  saveProduct(product: IProduct): Observable<IProduct> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    if (product.id === 0) {
      return this.createProduct(product, options);
    }
    return this.updateProduct(product, options);
  }

  private createProduct(product: IProduct, options: RequestOptions): Observable<IProduct> {
    product.id = undefined;
    return this.http.post(this.baseUrl, product, options)
      .map(this.extractData)
      .do(data => console.log('createProduct: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private updateProduct(product: IProduct, options: RequestOptions): Observable<IProduct> {
    const url = `${this.baseUrl}/${product.id}`;
    return this.http.put(url, product, options)
      .map(() => product)
      .do(data => console.log('updateProduct: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private extractData(response: Response) {
    const body = response.json();
    console.log(body);
    return body.data || {};
  }

  private handleError(error: Response): Observable<any> {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  initializeProduct(): IProduct {
    // Return an initialized object
    return {
      id: 0,
      productName: null,
      productCode: null
    };
  }
}
