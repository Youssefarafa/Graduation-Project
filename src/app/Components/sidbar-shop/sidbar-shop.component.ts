import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { CartService } from '../../core/services/cart.service';
import { WishListService } from '../../core/services/wish-list.service';

@Component({
  selector: 'app-sidbar-shop',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidbar-shop.component.html',
  styleUrl: './sidbar-shop.component.scss',
})
export class SidbarShopComponent implements OnInit {
  private readonly _CartService = inject(CartService);
  private readonly _WishListService = inject(WishListService);
  counterCart: number = 0;
  wishCount: number = 0;
  isOpen = false;

  constructor(
    private eRef: ElementRef,
    private platformDetectionService: PlatformDetectionService
  ) {}

  getAllProduct = () => {
    // this.spinner.show('CartShop');
    this._CartService.GetUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this._CartService.counterCart.next(res.numOfCartItems);
      },
    });
  };

  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });
      this.platformDetectionService.executeAfterDOMRender(() => {
        this.getAllProduct();
        this._WishListService.counterWishList.next(this._WishListService.getWishlist().length);
        this._CartService.counterCart.subscribe({
          next: (counter) => {
            this.counterCart=counter;
          },
          error: (err) => {
            console.log(err);
          },
        });
        this._WishListService.counterWishList.subscribe(count => {
          this.wishCount = count;
        });
      });
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  // Close sidebar when clicking outside of it
  @HostListener('document:click', ['$event'])
  closeSidebar(event: Event) {
    if (
      this.platformDetectionService.isBrowser &&
      this.isOpen &&
      !this.eRef.nativeElement.contains(event.target)
    ) {
      this.isOpen = false;
    }
  }

  // Close sidebar when clicking on a link
  closeOnLinkClick() {
    if (this.platformDetectionService.isBrowser) {
      this.isOpen = false;
    }
  }
}
