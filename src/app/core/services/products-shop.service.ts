import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../environments/enviroment.local';
import { Observable } from 'rxjs';
import { Products } from '../interface/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsShopService {
  constructor(private _HttpClient: HttpClient) {}
  getproducts = ():Observable<Products> => {
    return this._HttpClient.get<Products>(baseUrl+'api/v1/products');
  };
  getOneproduct = (id:string):Observable<Products> => {
    return this._HttpClient.get<Products>(`${baseUrl}api/v1/products/${id}`);
  };
}
