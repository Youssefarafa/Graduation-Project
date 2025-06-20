import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, baseUrlMustafa } from '../../environments/enviroment.local';
import { Observable } from 'rxjs';
import { Products } from '../interface/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsShopService {
  constructor(private _HttpClient: HttpClient) {}

  getSomeproducts = (
    pageSize: number,
    pageIndex: number
  ): Observable<Products> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.get<Products>(
      baseUrlMustafa +
        `api/Product/GetAllProducts?PageSize=${pageSize}&PageIndex=${pageIndex}`,
      { headers }
    );
  };

  getSomeproductsByCategory = (
    idCategory: number,
    pageSize: number = 20,
    pageIndex: number = 1
  ): Observable<Products> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.get<Products>(
      baseUrlMustafa +
        `api/Product/GetAllProducts?PageSize=${pageSize}&PageIndex=${pageIndex}&TybeId=${idCategory} `,
      { headers }
    );
  };

  getBestproducts = (): Observable<Products> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.get<Products>(
      baseUrlMustafa +
        'api/Product/GetAllProducts?PageSize=10&PageIndex=1&Sort=RateDesc',
      { headers }
    );
  };

  getSearchproducts = (term: string): Observable<Products> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.get<Products>(
      baseUrlMustafa +
        `api/Product/GetAllProducts?PageSize=10&PageIndex=1&Sort=RateDesc&Search=${term}`,
      { headers }
    );
  };

  getSearchproductsByCategory(
    term: string,
    idCategory: number
  ): Observable<Products> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.get<Products>(
      `${baseUrlMustafa}api/Product/GetAllProducts?PageSize=10&PageIndex=1&Sort=RateDesc&Search=${term}&TybeId=${idCategory}`,
      { headers }
    );
  }

  getOneproduct = (id: string): Observable<Products> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.get<Products>(
      `${baseUrlMustafa}api/Product/${id}`,
      { headers }
    );
  };
}
