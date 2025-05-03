import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Products } from '../interface/products';
import { baseUrl } from '../../environments/enviroment.local';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private _HttpClient: HttpClient) {}
  getcategories = ():Observable<any> => {
    return this._HttpClient.get(baseUrl+'api/v1/categories');
  };
}
