import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  let _ToastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((err) => {
      const toastRef = _ToastrService.error(err.message, 'An Error Occurred!', {
        progressBar: true,
        closeButton: true,
        timeOut: 3500,
        tapToDismiss: false,
        toastClass:
          'ngx-toastr !font-Roboto !bg-red-600 !text-red-100 dark:!bg-red-600 custom-toast-animate hover:!cursor-default !text-sm md:!text-base !w-[100%] md:!w-[450px] !mt-[70px]',
      });

      const toastEl = toastRef.toastRef.componentInstance.toastElement;

      let leaveTimeout: any;
      let autoCloseTimeout: any;

      const startAutoClose = () => {
        if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
        autoCloseTimeout = setTimeout(() => {
          toastEl.classList.add('toast-exit');
          setTimeout(() => {
            toastRef.toastRef.manualClose();
          }, 400);
        }, 3500);
      };

      startAutoClose();

      toastEl.addEventListener('mouseenter', () => {
        if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
        if (leaveTimeout) clearTimeout(leaveTimeout);
        toastEl.classList.remove('toast-exit');
      });

      toastEl.addEventListener('mouseleave', () => {
        leaveTimeout = setTimeout(() => {
          toastEl.classList.add('toast-exit');
          setTimeout(() => {
            toastRef.toastRef.manualClose();
          }, 400);
        }, 1000);
      });
      return throwError(() => {
        err;
      });
    })
  );
};
