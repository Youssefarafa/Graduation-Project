import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  let spinner = inject(NgxSpinnerService);
  if(req.url.includes('products/')){
    spinner.show('ProductDetails');
  }else if(req.url.includes('cart')){
    spinner.show('CartShop');
  }else{
    spinner.show('app');
  }
  return next(req).pipe(finalize(()=>{
    setTimeout(() => {
      spinner.hide('ProductDetails');
      spinner.hide('CartShop');
      spinner.hide('app');
    }, 1000);
  }));
};
