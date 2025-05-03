import { Component, inject, Input, OnInit } from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-button-cart',
  standalone: true,
  imports: [],
  templateUrl: './button-cart.component.html',
  styleUrl: './button-cart.component.scss',
})
export class ButtonCartComponent implements OnInit {
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  @Input() id!: string;
  constructor(private platformDetectionService: PlatformDetectionService) {}
  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this.platformDetectionService.executeAfterDOMRender(() => {});
    }
  }

  isClick: boolean = false;
  currentToastTimeout: any = null;
  mouseleavecurrentToastTimeout: any = null;
  AddToCart() {
    this.isClick = true;
    console.log(this.id);
    
    this._CartService.addProductToCart(this.id).subscribe({
      next: (res) => {
        console.log(res); //'Product added successfully to your cart'
        const toastRef = this._ToastrService.success(
          res.message,
          'Successful operation!',
          {
            progressBar: true,
            closeButton: true,
            timeOut: 3500,
            tapToDismiss: false,
            toastClass:
              'ngx-toastr !font-Roboto !bg-green-600 !text-green-100 dark:!bg-green-600 custom-toast-animate hover:!cursor-default !text-sm md:!text-base !w-[100%] md:!w-[450px] !mt-[70px]',
          }
        );

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
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('the adding to cart complete');
        this.isClick = false;
      },
    });
  }
}
