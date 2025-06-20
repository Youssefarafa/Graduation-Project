import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import {
  baseUrl,
  baseUrlAI,
  baseUrlMustafa,
} from '../../environments/enviroment.local';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  counterOrder: BehaviorSubject<number> = new BehaviorSubject(0);
  constructor(private _HttpClient: HttpClient) {}

  CreateOrder = (): Observable<any> => {
    const addressFormRaw = localStorage.getItem('addressForm');
    const shippingForm = localStorage.getItem('shippingForm');
    let phoneNumber = '01024643785';
    let deliveryMethodId = 0;
    if (addressFormRaw && shippingForm) {
      try {
        const addressForm = JSON.parse(addressFormRaw);
        const shipping = JSON.parse(shippingForm);
        if (addressForm.phone && shipping.shippingMethod ) {
          phoneNumber = String(addressForm.phone);
          deliveryMethodId = Number(String(shipping.shippingMethod));
        }
      } catch (err) {
        console.warn('Invalid JSON in addressForm:', err);
      }
    }
    const body = { phoneNumber: phoneNumber,deliveryMethodId:deliveryMethodId};
    console.log('📦 Payload being sent:', body);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.post(
      `${baseUrlMustafa}api/Orders/Create_Order`,
      body,
      {
        headers,
      }
    );
  };

    getOrdersForUser() {
    const token = localStorage.getItem('token');
    if (!token) return of({ error: 'Authorization token not found.' });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this._HttpClient.get<any[]>(`${baseUrlMustafa}api/Orders/GetAllOrderForSpecificUser`, {
      headers,
    }).pipe(
      catchError((err) => {
        console.error('Order fetch error:', err);
        return of({ error: 'Failed to load orders.' });
      })
    );
  }

  AddUserAddress = (address: any): Observable<any> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.put(
      baseUrlMustafa + `api/Account/UpdateUserAddress`,
      address,
      { headers }
    );
  };

  createCheckoutSession(price: any, id: any) {
    console.log({
      amount: Number(price),
      successUrl: 'http://localhost:4200/#/User/Shop/Products',
      cancelUrl: `http://localhost:4200/#/User/Shop/SelectPayment/${id}`,
    });
    return this._HttpClient.post<{ url: string }>(
      `http://localhost:5001/api/payments/create-checkout-session`,
      {
        amount: Number(price),
        successUrl: 'http://localhost:4200/#/User/Shop/Products',
        cancelUrl: `http://localhost:4200/#/User/Shop/SelectPayment/${id}`,
      }
    );
  }

  // headers = { token: localStorage.getItem('token')! };
  // createCashOrder = (cartId: string, shippingAddress: any): Observable<any> => {
  //   return this._HttpClient.post(
  //     baseUrl + `api/v1/orders/${cartId}`,
  //     { shippingAddress },
  //     { headers: { ...this.headers } }
  //   );
  // };

  // createVisaOrder = (cartId: string, shippingAddress: any): Observable<any> => {
  //   return this._HttpClient.post(
  //     baseUrl + `api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200/User/Shop/SelectPayment/${cartId}`,
  //     { shippingAddress },
  //     { headers: { ...this.headers } }
  //   );
  // };
}
