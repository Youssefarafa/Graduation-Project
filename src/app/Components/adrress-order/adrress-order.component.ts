import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-adrress-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adrress-order.component.html',
  styleUrl: './adrress-order.component.scss',
})
export class AdrressOrderComponent implements OnInit {
  private readonly _PlatformDetectionService = inject(PlatformDetectionService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _Router = inject(Router);
  private readonly _OrderService = inject(OrderService);

  typeDetails: FormGroup = new FormGroup({
    Street: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(15),
    ]),
    Country: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(15),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^01[0-9]{9}$/),
    ]),
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(15),
    ]),
  });
  id: string | null = '';

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

  isSubnitClick: boolean = false;
  onSubmit() {
    this.isSubnitClick = true;
    if (this.typeDetails.valid) {
      console.log({
        city: this.typeDetails.get('city')?.value ?? ('' as string),
        street: this.typeDetails.get('Street')?.value ?? ('' as string),
        country: this.typeDetails.get('Country')?.value ?? ('' as string),
      });

      this._OrderService
        .AddUserAddress({
          city: this.typeDetails.get('city')?.value ?? ('' as string),
          street: this.typeDetails.get('Street')?.value ?? ('' as string),
          country: this.typeDetails.get('Country')?.value ?? ('' as string),
        })
        .subscribe({
          next: (res) => {
            console.log('Submitted data:', this.typeDetails.value);
            localStorage.setItem(
              'addressForm',
              JSON.stringify(this.typeDetails.value)
            );
            this._Router.navigate([`/User/Shop/SelectOptions/${this.id}`]);
            this.isSubnitClick = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.typeDetails.markAllAsTouched();
      this.isSubnitClick = false;
    }
  }
}
