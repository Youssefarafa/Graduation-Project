import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-select-payment-process',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-payment-process.component.html',
  styleUrl: './select-payment-process.component.scss',
})
export class SelectPaymentProcessComponent implements OnInit {
  private readonly _PlatformDetectionService = inject(PlatformDetectionService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrderService = inject(OrderService);
  private readonly _Router = inject(Router);
  private readonly _CartService = inject(CartService);
  id: string | null = '';
  addressFormValue: any = null;
  cart: any = null;

  ngOnInit() {
    if (this._PlatformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this._PlatformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this._PlatformDetectionService.executeAfterDOMRender(() => {
        this._OrderService.getOrdersForUser().subscribe({
          next: (res) => {
            if (Array.isArray(res)) {
              this._OrderService.counterOrder.next(res.length);
            }
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('product get complete.');
          },
        });
        this._CartService.GetUserCart().subscribe({
          next: (res) => {
            console.log(res);
            this.cart = res;
            this._CartService.counterCart.next(res.items.length);
          },
          error: (err) => {
            console.log(err);
            this._CartService.counterCart.next(0);
            this.cart = null;
          },
          complete: () => {
            console.log('complete view cart');
          },
        });
        const saved = localStorage.getItem('addressForm');
        if (saved) {
          this.addressFormValue = JSON.parse(saved);
          console.log('from ffffffff', this.addressFormValue);
        }
        this._ActivatedRoute.paramMap.subscribe({
          next: (param) => {
            console.log('from fffffff', param.get('idCart'));
            this.id = param.get('idCart');
          },
          error: (err) => {
            console.log(err);
            this.id = null;
          },
        });
      });
    }
  }

  paymentForm = new FormGroup({
    method: new FormControl('', Validators.required),
  });
  isSubnitClick: boolean = false;
  isErrorSubmit: boolean = false;
  onSubmit() {
    if (this.id == null) {
      return;
    }
    if (this.addressFormValue == null || this.addressFormValue == '') {
      return;
    }
    this.isSubnitClick = true;
    if (this.paymentForm.valid) {
      const selected = this.paymentForm.value.method;
      console.log('Selected payment method:', selected);
      // TODO: navigate or call your payment API
      if (selected == 'cash') {
        this._OrderService.CreateOrder().subscribe({
          next: (res) => {
            console.log('Order created:', res);
            localStorage.setItem('OrderCreated', JSON.stringify(res));
          },
          error: (err) => {
            console.log('Failed to create order:', err);
            this.isSubnitClick = false;
            this.isErrorSubmit = true;
          },
          complete: () => {
            console.log('complete create Cash Order');
            this._CartService.counterCart.next(0);
            this.isSubnitClick = false;
            this.isErrorSubmit = false;
            this._Router.navigate([`/User/Shop/TakeOrderCash/${this.id}`]);
          },
        });
      } else if (selected == 'stripe') {
        console.log(this.cart.totalPrice, this.id, 'hhhhhhhhhhhhhh');

        this._OrderService
          .createCheckoutSession(this.cart.totalPrice, this.id)
          .subscribe({
            next: (res) => {
              window.location.href = res.url; // 🔁 redirect to Stripe Checkout
            },
            error: (err) => {
              alert('Failed to initiate payment');
              console.error(err);
            },
          });

        // this._OrderService
        // .createVisaOrder(this.id, this.addressFormValue)
        // .subscribe({
        //   next: (res) => {
        //     console.log('Order created:', res);
        //     window.location.href= res.session.url
        //     // localStorage.setItem('OrderCreated', JSON.stringify(res));
        //   },
        //   error: (err) => {
        //     console.log('Failed to create order:', err);
        //     this.isSubnitClick = false;
        //     this.isErrorSubmit=true;
        //   },
        //   complete: () => {
        //     console.log('complete create Cash Order');
        //     this.isSubnitClick = false;
        //     this.isErrorSubmit=false;
        //     // this._Router.navigate([`/User/Shop/TakeOrderCash/${this.id}`]);
        //   },
        // });
      } else {
        this.isSubnitClick = false;
        return;
      }
    } else {
      this.isSubnitClick = false;
    }
  }
}
