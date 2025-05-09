import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Products } from '../interface/products';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from '../../environments/enviroment.local';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  counterCart:BehaviorSubject<number>=new BehaviorSubject(0);
  headers = { token: localStorage.getItem('token')! };
  constructor(private _HttpClient: HttpClient) {}
  
  addProductToCart = (id: string): Observable<any> => {
    return this._HttpClient.post(
      baseUrl + 'api/v1/cart',
      { productId: id },
      { headers: { ...this.headers } }
    );
  };

  UpdateCartQTY = (id: string, countnum: number): Observable<any> => {
    return this._HttpClient.post(
      baseUrl + 'api/v1/cart/' + id,
      { count: countnum },
      { headers: { ...this.headers } }
    );
  };

  RemoveProduct = (id: string): Observable<any> => {
    return this._HttpClient.delete(baseUrl + 'api/v1/cart/' + id, {
      headers: { ...this.headers },
    });
  };

  ClearCart = (): Observable<any> => {
    return this._HttpClient.delete(baseUrl + 'api/v1/cart/', {
      headers: { ...this.headers },
    });
  };

  GetUserCart = (): Observable<any> => {
    return this._HttpClient.get(baseUrl + 'api/v1/cart/', {
      headers: { ...this.headers },
    });
  };
}
