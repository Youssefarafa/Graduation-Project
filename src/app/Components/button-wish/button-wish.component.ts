import { Component, OnInit } from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button-wish',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button-wish.component.html',
  styleUrl: './button-wish.component.scss'
})
export class ButtonWishComponent implements OnInit{
 isFavorite = false; // Track if it's in the wishlist
  isBouncing = true;  // Track animation state
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
  toggleWishlist() {
    this.isFavorite = !this.isFavorite;  // Toggle SVG color
    this.isBouncing = !this.isBouncing;  // Toggle animation
  }
}
