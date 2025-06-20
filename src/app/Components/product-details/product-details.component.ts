import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { Data, Products } from '../../core/interface/products';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
} from 'ngx-owl-carousel-o';
import { NgOptimizedImage } from '@angular/common';
import { ButtonWishComponent } from '../button-wish/button-wish.component';
import { ShowProdutsComponent } from '../show-produts/show-produts.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../core/services/order.service';

interface ProductRating {
  productId: string;
  rating: number;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ButtonWishComponent,
    ShowProdutsComponent,
    CarouselModule,
    NgClass,
    NgOptimizedImage,
    NgxSpinnerComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnChanges {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _PlatformDetectionService = inject(PlatformDetectionService);
  private readonly _ProductsShopService = inject(ProductsShopService);
  private spinner = inject(NgxSpinnerService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private _cdr = inject(ChangeDetectorRef);
  ProductDetails!: any;
  products?: Products;
  ProductsShop: any = this.products?.data;
  starSize = 'w-4 h-4'; // Add this property
  stars: ('full' | 'half' | 'empty')[] = [];
  starshis: ('full' | 'half' | 'empty')[] = [];
  isInCart: boolean = false;
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
        let id: string | null = '';
        //? console.log(this._ActivatedRoute.snapshot.params['idProduct']);  it not used because not subscribe.
        this._ActivatedRoute.paramMap.subscribe({
          next: (param) => {
            // this.spinner.show('ProductDetails');
            console.log(param.get('idProduct'));
            id = param.get('idProduct');
            console.log(id);

            this.userRating = this.getUserRating(id!);
            this.calculateStarshis(this.userRating);
            this._ProductsShopService.getOneproduct(id!).subscribe({
              next: (res) => {
                console.log(res);
                this.ProductDetails = res;
                console.log(this.ProductDetails);
                this.calculateStars();
                this.getProducts(this.ProductDetails);
                this.checkCartStatus();
              },
              error: (err) => {
                console.log(err);
                id = null;
                // setTimeout(() => {
                // this.spinner.hide('ProductDetails');
                // }, 2000);
              },
              complete: () => {
                console.log('product get complete.');
                // setTimeout(() => {
                //   this.spinner.hide('ProductDetails');
                // }, 2000);
              },
            });
          },
          error: (err) => {
            console.log(err);
            id = null;
          },
        });
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
          (item: any) => item.productId === this.ProductDetails.id
        );
      },
      error: (err) => {
        console.error('Error checking cart status:', err);
      },
    });
  }

  getProducts = (product: any) => {
    return this._ProductsShopService
      .getSomeproductsByCategory(product.typeId)
      .subscribe({
        next: (res) => {
          this.products = res;
          const allProducts = this.products?.data ?? [];
          // Exclude the specified product by ID (or compare full object if needed)
          const filtered = allProducts.filter((p) => p.id !== product.id);
          // Shuffle and pick 5 from remaining products
          const shuffled = [...filtered].sort(() => 0.5 - Math.random());
          this.ProductsShop = shuffled.slice(0, 5);
        },
        error: (err) => {
          console.error('Error fetching products:', err);
        },
        complete: () => {
          console.log('Product fetching complete');
        },
      });
  };

  private calculateStars() {
    const rating = this.ProductDetails?.rate || 0;
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    this.stars = Array(5)
      .fill('empty')
      .map((_, index) => {
        if (index < fullStars) return 'full';
        if (index === fullStars && hasHalf) return 'half';
        return 'empty';
      });
  }

  private calculateStarshis(rate: number) {
    const fullStars = Math.floor(rate);
    const hasHalf = rate % 1 >= 0.5;
    this.starshis = Array(5)
      .fill('empty')
      .map((_, index) => {
        if (index < fullStars) return 'full';
        if (index === fullStars && hasHalf) return 'half';
        return 'empty';
      });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    pullDrag: false,
    touchDrag: false,
    freeDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
        center: false,
      },
      400: {
        items: 1,
        center: false,
      },
      740: {
        items: 1,
        center: false,
      },
      940: {
        items: 1,
        center: false,
      },
    },
    nav: false, // Disable navigation arrows
    stagePadding: 0,
    center: false,
    dotsEach: true,
    autoplay: false, // Enable autoplay
  };
  messageerr: any = null;
  isClick: boolean = false;
  currentToastTimeout: any = null;
  mouseleavecurrentToastTimeout: any = null;
  // Updated AddToCart method in product-details.component.ts
AddToCart(id: string) {
  this.isClick = true;

  // Check if product was already in cart
  const wasInCart = this.isInCart;

  this._CartService.addProductToCart(id).subscribe({
    next: (res) => {
      this._CartService.counterCart.next(res.items.length);
      this.messageerr = null;

      // Update cart status
      this.isInCart = true;

      // Toast message based on previous cart status
      const des = wasInCart
        ? 'Increase Product to Cart Successfully'
        : 'Added Product to Cart Successfully';

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

      // Optional: handle toast hover animation (same logic as before)
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
      this.messageerr = err;
    },
    complete: () => {
      console.log('the adding to cart complete');
      this.isClick = false;
    },
  });
}


  showRatingModal = false;
  userRating = 0;
  currentProductId: string = '';

  // Open the modal and store product id
  openRatingModal(productId: string) {
    this.currentProductId = productId;
    this.userRating = this.getUserRating(productId); // Load existing rating if exists
    this.showRatingModal = true;
  }

  // Close modal and reset rating
  closeRatingModal() {
    this.showRatingModal = false;
    this.userRating = 0;
    this.currentProductId = '';
  }

  // Submit the rating and update localStorage
  submitRating() {
    this.spinner.show('rating');
    const productId = this.currentProductId;
    let ratings = this.getStoredRatings();
    const index = ratings.findIndex((r) => r.productId === productId);
    this.calculateStarshis(this.userRating);
    if (this.userRating > 0) {
      if (index !== -1) {
        // Update existing
        ratings[index].rating = this.userRating;
      } else {
        // Add new
        ratings.push({ productId, rating: this.userRating });
      }
    } else {
      // Remove if rating is 0
      if (index !== -1) {
        ratings.splice(index, 1);
      }
    }
    this.saveRatings(ratings);
    console.log(`Rated ${productId} with ${this.userRating} stars`);
    this.currentProductId = '';
    this.showRatingModal = false;
    setTimeout(() => {
      this.spinner.hide('rating');
      this._cdr.detectChanges();
    }, 1000);

    const toastRef = this._ToastrService.success(
      'You Add Your Ratting Successfully',
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
    setTimeout(() => {
      const toastEl = toastRef.toastRef?.componentInstance?.toastElement;

      if (!toastEl) return;

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
    }, 0); // defer execution after DOM update
  }

  clearRating() {
    const productId = this.currentProductId;
    let ratings = this.getStoredRatings();
    const index = ratings.findIndex((r) => r.productId === productId);
    if (this.userRating > 0) {
      this.spinner.show('rating');
      this.calculateStarshis(this.userRating);
      // userRating = 0 → remove
      if (index !== -1) {
        ratings.splice(index, 1);
      }
      setTimeout(() => {
        this.spinner.hide('rating');
      }, 1000);
    } else {
      // userRating = 0 → remove
      if (index !== -1) {
        ratings.splice(index, 1);
      }
    }
    this.saveRatings(ratings);
    this.showRatingModal = false;
    this.userRating = 0;
    this.currentProductId = '';

    const toastRef = this._ToastrService.success(
      'You Remove Your Ratting Successfully',
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
    setTimeout(() => {
      const toastEl = toastRef.toastRef?.componentInstance?.toastElement;

      if (!toastEl) return;

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
    }, 0); // defer execution after DOM update
  }

  // Retrieve all saved ratings
  getStoredRatings(): ProductRating[] {
    const stored = localStorage.getItem('productRatings');
    return stored ? JSON.parse(stored) : [];
  }

  // Save ratings array to localStorage
  saveRatings(ratings: ProductRating[]): void {
    localStorage.setItem('productRatings', JSON.stringify(ratings));
  }

  // Get rating for a specific product
  getUserRating(productId: string): number {
    const ratings = this.getStoredRatings();
    const found = ratings.find((r) => r.productId === productId);
    return found ? found.rating : 0;
  }
}
