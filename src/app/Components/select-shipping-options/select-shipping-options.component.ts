import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-shipping-options',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './select-shipping-options.component.html',
  styleUrl: './select-shipping-options.component.scss'
})
export class SelectShippingOptionsComponent implements OnInit {
  private readonly _PlatformDetectionService = inject(PlatformDetectionService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _Router = inject(Router);
  id: string|null = '';
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
        this._ActivatedRoute.paramMap.subscribe({
          next: (param) => {
            console.log(param.get('idCart'));
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
  shippingOptions = [
    {
      ShortName: 'UPS1',
      Description: {
        Summary: 'Fastest delivery time',
        Details: 'Includes priority handling and real-time tracking. Ideal for urgent deliveries or high-value items.'
      },
      DeliveryTime: '1-2 Days',
      Cost: 10
    },
    {
      ShortName: 'UPS2',
      Description: {
        Summary: 'Get it within 5 days',
        Details: 'Reliable standard shipping with tracking. Suitable for most personal and business deliveries.'
      },
      DeliveryTime: '2-5 Days',
      Cost: 5
    },
    {
      ShortName: 'UPS3',
      Description: {
        Summary: 'Slower but cheap',
        Details: 'Economy service for budget-conscious deliveries. Basic tracking included. Use for non-urgent items.'
      },
      DeliveryTime: '5-10 Days',
      Cost: 2
    },
    {
      ShortName: 'FREE',
      Description: {
        Summary: 'Free! You get what you pay for',
        Details: 'Longest delivery time with no guaranteed date. No tracking. Suitable only for non-critical shipments.'
      },
      DeliveryTime: '1-2 Weeks',
      Cost: 0
    }
  ];
  

  shippingForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.shippingForm = this.fb.group({
      shippingMethod:  new FormControl('', Validators.required) 
    });
  }










  isErrorSubmit:boolean=false; //? used when api.
  isSubnitClick: boolean = false;
  onSubmit() {
    this.isSubnitClick = true;
    if (this.shippingForm.valid) {
      console.log('Submitted data:', this.shippingForm.value);
      localStorage.setItem('shippingForm', JSON.stringify(this.shippingForm.value));
      this._Router.navigate([`/User/Shop/SelectPayment/${this.id}`]);
      this.isSubnitClick = false;
    } else {
      this.shippingForm.markAllAsTouched();
      this.isSubnitClick = false;
    }
  }
}
