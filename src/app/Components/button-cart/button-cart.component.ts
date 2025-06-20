import {
  Component,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
export class ButtonCartComponent implements OnInit, OnChanges {
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  @Input() id!: string;
  @Input() product!: any;

  messageerr: any = null;
  isClick: boolean = false;
  isInCart: boolean = false;

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
      this.platformDetectionService.executeAfterDOMRender(() => {
        // Check initial cart status
        this.checkCartStatus();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Reset cart status when product ID changes
    if (
      changes['id'] &&
      changes['id'].currentValue !== changes['id'].previousValue
    ) {
      this.isInCart = false;
      this.checkCartStatus();
    }
  }

  // Check if product is already in cart
  checkCartStatus() {
    this._CartService.GetUserCart().subscribe({
      next: (cart) => {
        this.isInCart = cart.items.some(
          (item: any) => item.productId === this.id
        );
      },
      error: (err) => {
        console.error('Error checking cart status:', err);
      },
    });
  }

  AddToCart() {
    this.isClick = true;

    // store current cart status before adding
    const wasInCart = this.isInCart;

    this._CartService.addProductToCart(this.id).subscribe({
      next: (res) => {
        this._CartService.counterCart.next(res.items.length);
        this.messageerr = null;
        this.isInCart = true;

        // Use previous state to determine toast message
        const des = wasInCart
          ? 'Increase Product to Cart Successfully'
          : 'Added Product to Cart Successfully';

        // Show success toast
        const toastRef = this._ToastrService.success(
          des,
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
        console.error(err);
        this.messageerr = err;
      },
      complete: () => {
        this.isClick = false;
      },
    });
  }
}
