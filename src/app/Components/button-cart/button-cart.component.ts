import { Component, OnInit } from '@angular/core';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';

@Component({
  selector: 'app-button-cart',
  standalone: true,
  imports: [],
  templateUrl: './button-cart.component.html',
  styleUrl: './button-cart.component.scss'
})
export class ButtonCartComponent implements OnInit{
  constructor(
    private platformDetectionService: PlatformDetectionService,
    private _ProductsShopService: ProductsShopService
  ) {}
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
      });
    }
  }
}
