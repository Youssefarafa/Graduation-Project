import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl, baseUrlMustafa } from '../../environments/enviroment.local';
import { SignupUser } from '../interface/signup-user';
import { SigninUser } from '../interface/signin-user';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ForgetPasswordUser } from '../interface/forget-password-user';
import { VerifyResetCodeUser } from '../interface/verify-reset-code-user';
import { ResetPasswordUser } from '../interface/reset-password-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _HttpClient: HttpClient) {}
  private readonly _Router = inject(Router);
  private readonly cookieService = inject(CookieService);
  signup = (user: SignupUser): Observable<any> => {
    return this._HttpClient.post<any>(
      baseUrlMustafa + 'api/Account/Register',
      user
    );
  };
  signin = (user: SigninUser): Observable<any> => {
    return this._HttpClient.post<any>(
      baseUrlMustafa + 'api/Account/Login',
      user
    );
  };
  registerWithFirebase = (user: any): Observable<any> => {
    return this._HttpClient.post<any>(
      baseUrlMustafa + 'api/ExternalAccount/firebase-login',
      user
    );
  };
  saveUserData = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log(decoded);
        } catch (error) {
          this._Router.navigate(['/Start/Home']);
          localStorage.removeItem('token');
          this.cookieService.delete('auth_token');
        }
      } else {
        this._Router.navigate(['/Start/Home']);
        localStorage.removeItem('token');
        this.cookieService.delete('auth_token');
      }
    }
  };
  forgetPassword = (user: ForgetPasswordUser): Observable<any> => {
    return this._HttpClient.post<any>(
      baseUrlMustafa + 'api/Account/forget-password',
      user
    );
  };
  verifyResetCode = (user: VerifyResetCodeUser): Observable<any> => {
    return this._HttpClient.post<any>(
      baseUrlMustafa + 'api/Account/verify-reset-password-code',
      user,
      { responseType: 'text' as 'json' }
    );
  };
  resetPassword = (user: ResetPasswordUser): Observable<any> => {
    return this._HttpClient.post<any>(
      baseUrlMustafa + 'api/Account/reset-password',
      user,
      { responseType: 'text' as 'json' }
    );
  };























  addPhoto = (file: any): Observable<any> => {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')!,
    });
    return this._HttpClient.post(
      baseUrlMustafa + 'api/Account/upload-user-picture',
      file,
      { headers }
    );
  };
}
