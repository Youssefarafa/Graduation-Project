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
  id: string | null = '';
  addressFormValue: any = null;

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
  isErrorSubmit:boolean=false;
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
        this._OrderService
          .createCashOrder(this.id, this.addressFormValue)
          .subscribe({
            next: (res) => {
              console.log('Order created:', res);
              localStorage.setItem('OrderCreated', JSON.stringify(res));
            },
            error: (err) => {
              console.log('Failed to create order:', err);
              this.isSubnitClick = false;
              this.isErrorSubmit=true;
            },
            complete: () => {
              console.log('complete create Cash Order');
              localStorage.removeItem('addressForm');
              this.isSubnitClick = false;
              this.isErrorSubmit=false;
              this._Router.navigate([`/User/Shop/TakeOrderCash/${this.id}`]);
            },
          });
      } else if (selected == 'stripe') {
        this.isSubnitClick = false;
      } else {
        this.isSubnitClick = false;
        return;
      }
    } else {
      this.isSubnitClick = false;
    }
  }
}
