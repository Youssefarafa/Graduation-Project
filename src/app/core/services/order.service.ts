import { Injectable } from '@angular/core';
import { baseUrl } from '../../environments/enviroment.local';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _HttpClient: HttpClient) {}
  headers = { token: localStorage.getItem('token')! };
  createCashOrder = (cartId: string, shippingAddress: any): Observable<any> => {
    return this._HttpClient.post(
      baseUrl + `api/v1/orders/${cartId}`,
      { shippingAddress },
      { headers: { ...this.headers } }
    );
  };
  
  createVisaOrder = (cartId: string, shippingAddress: any): Observable<any> => {
    return this._HttpClient.post(
      baseUrl + `api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200/User/Shop/SelectPayment/${cartId}`,
      { shippingAddress },
      { headers: { ...this.headers } }
    );
  };
}
