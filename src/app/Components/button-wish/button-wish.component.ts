import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { WishListService } from '../../core/services/wish-list.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button-wish',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button-wish.component.html',
  styleUrl: './button-wish.component.scss',
})
export class ButtonWishComponent implements OnInit {
  isFavorite = false; // Track if it's in the wishlist
  isBouncing = true; // Track animation state
  @Input() product!: any;
  constructor(
    private platformDetectionService: PlatformDetectionService,
    private _ProductsShopService: ProductsShopService,
    private _WishListService: WishListService
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
        // console.log("hhhhhhhhhhhhhhhhhhhh hhhjjjjjjjjjj000000000000000000",this.product);
        const productId = this.product?.id;
        if (productId && this._WishListService.isInWishlist(productId)) {
          this.isFavorite = true;
          this.isBouncing = false;
        } else {
          this.isFavorite = false;
          this.isBouncing = true;
        }
      });
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue) {
      // console.log('Product arrived:', this.product);
      // console.log("hhhhhhhhhhhhhhhhhhhh ppppppppppppppppppppp",this.product);
      const productId = this.product?.id;
      if (productId && this._WishListService.isInWishlist(productId)) {
        this.isFavorite = true;
        this.isBouncing = false;
      } else {
        this.isFavorite = false;
        this.isBouncing = true;
      }
    }
  }

  toggleWishlist() {
    const productId = this.product?.id;
    if (!productId) {
      return
    };
    // Toggle in localStorage using service
    this.isFavorite = this._WishListService.toggleWishlist(this.product);
    // Bouncing is only true when just added
    this.isBouncing = !this.isFavorite;
  }
  
}
