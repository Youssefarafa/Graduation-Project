import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Products } from '../interface/products';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl, baseUrlMustafa } from '../../environments/enviroment.local';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  counterCart: BehaviorSubject<number> = new BehaviorSubject(0);
  constructor(private _HttpClient: HttpClient) {}

  addProductToCart = (id: string): Observable<any> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.post(
      baseUrlMustafa + 'api/Basket/add-item',
      { productId: id, quantity: 1 },
      { headers }
    );
  };

  IncreaseItemQuantity = (id: string): Observable<any> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.post(
      baseUrlMustafa + `api/Basket/IncreaseItemQuantity/${id}`,
      {}, // Empty body
      { headers } // ✅ Correct location for headers
    );
  };

  DecreaseItemQuantity = (id: string): Observable<any> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.post(
      baseUrlMustafa + `api/Basket/DecreaseItemQuantity/${id}`,
      {}, // Empty body
      { headers } // ✅ Correct location for headers
    );
  };

  // UpdateCartQTY = (id: string, countnum: number): Observable<any> => {
  //   const headers = new HttpHeaders({
  //     Authorization: 'Bearer ' + localStorage.getItem('token')!,
  //   });
  //   return this._HttpClient.post(
  //     baseUrl + 'api/v1/cart/' + id,
  //     { count: countnum },
  //     { headers }
  //   );
  // };

  RemoveProduct = (id: string): Observable<any> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.delete(
      baseUrlMustafa + 'api/Basket/remove-item/' + id,
      { headers }
    );
  };

  ClearCart = (): Observable<any> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.delete(baseUrlMustafa + 'api/Basket/Clear_Basket', {
      headers,
    });
  };

  GetUserCart = (): Observable<any> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.get(baseUrlMustafa + 'api/Basket/Get_Basket', {
      headers,
    });
  };
}
