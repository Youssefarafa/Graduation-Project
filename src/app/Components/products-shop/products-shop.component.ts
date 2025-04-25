import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { Products } from '../../core/interface/products';
import { ButtonWishComponent } from '../button-wish/button-wish.component';
import { ButtonCartComponent } from '../button-cart/button-cart.component';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-products-shop',
  standalone: true,
  imports: [ButtonWishComponent, ButtonCartComponent, CarouselModule],
  templateUrl: './products-shop.component.html',
  styleUrl: './products-shop.component.scss',
})
export class ProductsShopComponent implements OnInit, AfterViewInit {
  products?: Products;
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
        this.getProducts();
      });
    }
  }
  getProducts = () => {
    return this._ProductsShopService.getproducts().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
      complete: () => {
        console.log('Product fetching complete');
      },
    });
  };

  customOptions1: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    // pullDrag: false,
    // freeDrag:false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
        center: true,
      },
      400: {
        items: 1,
        center: true,
      },
      740: {
        items: 1,
        center: true,
      },
      940: {
        items: 1,
        center: true,
      },
    },
    nav: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplaySpeed: 400,
    autoplayHoverPause: true,
  };
customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    // pullDrag: false,
    // freeDrag:false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
        center: true,
      },
      400: {
        items: 1,
        center: true,
      },
      740: {
        items: 1,
        center: true,
      },
      940: {
        items: 1,
        center: true,
      },
    },
    nav: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplaySpeed: 400,
    autoplayHoverPause: true,
  };

  owlEl1: any;
  @ViewChild('carouselRef', { static: true }) carouselRef1!: CarouselComponent;
  @ViewChild('carouselRef', { read: ElementRef }) carouselElRef1!: ElementRef;
  @ViewChild('DivParentOfCarousel')
  DivParentOfCarousel1!: ElementRef<HTMLElement>;
  owlEl: any;
  @ViewChild('carouselRef', { static: true }) carouselRef!: CarouselComponent;
  @ViewChild('carouselRef', { read: ElementRef }) carouselElRef!: ElementRef;
  @ViewChild('DivParentOfCarousel')
  DivParentOfCarousel!: ElementRef<HTMLElement>;
  ngAfterViewInit() {
    this.owlEl1 =
      this.carouselElRef1.nativeElement.querySelector('.owl-carousel');
    this.DivParentOfCarousel1.nativeElement.addEventListener(
      'mouseleave',
      () => {
        this.owlEl1.style.cursor = 'default';
      }
    );
    let isThrottled1 = false;
    const throttleDelay1 = 800;
    if (this.owlEl1) {
      this.owlEl1.addEventListener(
        'wheel',
        (event: WheelEvent) => {
          this.owlEl1.style.cursor = 'default';
          event.preventDefault();
          if (isThrottled1) return;
          isThrottled1 = true;
          setTimeout(() => (isThrottled1 = false), throttleDelay1);
          if (event.deltaY < 0 || event.deltaX < 0) {
            (this.carouselRef1 as any).prev(); // <- safely use .previous()
          } else {
            (this.carouselRef1 as any).next(); // <- safely use .next()
          }
        },
        { passive: false }
      );
    }
    //! !!!!!!!!!!!!!!!!!!!!!!!!!
    this.owlEl =
      this.carouselElRef.nativeElement.querySelector('.owl-carousel');
    this.DivParentOfCarousel.nativeElement.addEventListener(
      'mouseleave',
      () => {
        this.owlEl.style.cursor = 'default';
      }
    );
    let isThrottled = false;
    const throttleDelay = 800;
    if (this.owlEl) {
      this.owlEl.addEventListener(
        'wheel',
        (event: WheelEvent) => {
          this.owlEl.style.cursor = 'default';
          event.preventDefault();
          if (isThrottled) return;
          isThrottled = true;
          setTimeout(() => (isThrottled = false), throttleDelay);
          if (event.deltaY < 0 || event.deltaX < 0) {
            (this.carouselRef as any).prev(); // <- safely use .previous()
          } else {
            (this.carouselRef as any).next(); // <- safely use .next()
          }
        },
        { passive: false }
      );
    }
  }

  private isPressing1 = false;
  private startX1 = 0;
  private startY1 = 0;
  private isMoving1 = false;
  private isPressing = false;
  private startX = 0;
  private startY = 0;
  private isMoving = false;

  @HostListener('mousedown', ['$event'])
  onMouseDown1(event: MouseEvent): void {
    this.isPressing1 = true;
    this.startX1 = event.clientX;
    this.startY1 = event.clientY;
    this.owlEl1.style.cursor = 'grabbing';
  }
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isPressing = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.owlEl.style.cursor = 'grabbing';
  }

  @HostListener('mouseup')
  onMouseUp1(): void {
    if (this.isPressing1) {
      this.isPressing1 = false;
      this.isMoving1 = false;
      this.owlEl1.style.cursor = 'grab';
    }
  }
  @HostListener('mouseup')
  onMouseUp(): void {
    if (this.isPressing) {
      this.isPressing = false;
      this.isMoving = false;
      this.owlEl.style.cursor = 'grab';
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove1(event: MouseEvent): void {
    if (this.isPressing1 && !this.isMoving1) {
      // Detect the movement and handle swipe (or pan) logic here.
      const deltaX = event.clientX - this.startX1;
      const deltaY = event.clientY - this.startY1;
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        this.isMoving1 = true;
      }
    }
  }
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isPressing && !this.isMoving) {
      // Detect the movement and handle swipe (or pan) logic here.
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        this.isMoving = true;
      }
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart1(event: TouchEvent): void {
    const touch = event.touches[0];
    this.isPressing1 = true;
    this.startX1 = touch.clientX;
    this.startY1 = touch.clientY;
    this.owlEl1.style.cursor = 'grabbing';
  }
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.isPressing = true;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.owlEl.style.cursor = 'grabbing';
  }

  @HostListener('touchend')
  onTouchEnd1(): void {
    if (this.isPressing1) {
      this.isPressing1 = false;
      this.isMoving1 = false;
      this.owlEl1.style.cursor = 'grab';
    }
  }
  @HostListener('touchend')
  onTouchEnd(): void {
    if (this.isPressing) {
      this.isPressing = false;
      this.isMoving = false;
      this.owlEl.style.cursor = 'grab';
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove1(event: TouchEvent): void {
    if (this.isPressing1 && !this.isMoving1) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.startX1;
      const deltaY = touch.clientY - this.startY1;
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        this.isMoving1 = true;
      }
    }
  }
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this.isPressing && !this.isMoving) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.startX;
      const deltaY = touch.clientY - this.startY;
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        this.isMoving = true;
      }
    }
  }

  // customOptions: OwlOptions = {
  //   loop: true,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   // pullDrag: false,
  //   // freeDrag:false,
  //   dots: false,
  //   navSpeed: 700,
  //   navText: ['', ''],
  //   responsive: {
  //     0: {
  //       items: 1,
  //       center: true,
  //     },
  //     400: {
  //       items: 1,
  //       center: true,
  //     },
  //     740: {
  //       items: 1,
  //       center: true,
  //     },
  //     940: {
  //       items: 1,
  //       center: true,
  //     },
  //   },
  //   nav: false,
  //   autoplay: true,
  //   autoplayTimeout: 2000,
  //   autoplaySpeed: 400,
  //   autoplayHoverPause: true,
  // };
  
  // owlEl: any;
  // @ViewChild('carouselRef', { static: true }) carouselRef!: CarouselComponent;
  // @ViewChild('carouselRef', { read: ElementRef }) carouselElRef!: ElementRef;
  // @ViewChild('DivParentOfCarousel')
  // DivParentOfCarousel!: ElementRef<HTMLElement>;
  // ngAfterViewInit() {
  //   this.owlEl =
  //     this.carouselElRef.nativeElement.querySelector('.owl-carousel');
  //   this.DivParentOfCarousel.nativeElement.addEventListener(
  //     'mouseleave',
  //     () => {
  //       this.owlEl.style.cursor = 'default';
  //     }
  //   );
  //   let isThrottled = false;
  //   const throttleDelay = 800;
  //   if (this.owlEl) {
  //     this.owlEl.addEventListener(
  //       'wheel',
  //       (event: WheelEvent) => {
  //         this.owlEl.style.cursor = 'default';
  //         event.preventDefault();
  //         if (isThrottled) return;
  //         isThrottled = true;
  //         setTimeout(() => (isThrottled = false), throttleDelay);
  //         if (event.deltaY < 0 || event.deltaX < 0) {
  //           (this.carouselRef as any).prev(); // <- safely use .previous()
  //         } else {
  //           (this.carouselRef as any).next(); // <- safely use .next()
  //         }
  //       },
  //       { passive: false }
  //     );
  //   }
  // }
  
  // private isPressing = false;
  // private startX = 0;
  // private startY = 0;
  // private isMoving = false;
  // private readonly el = inject(ElementRef);
  
  // @HostListener('mousedown', ['$event'])
  // onMouseDown(event: MouseEvent): void {
  //   this.isPressing = true;
  //   this.startX = event.clientX;
  //   this.startY = event.clientY;
  //   this.owlEl.style.cursor = 'grabbing';
  // }
  
  // @HostListener('mouseup')
  // onMouseUp(): void {
  //   if (this.isPressing) {
  //     this.isPressing = false;
  //     this.isMoving = false;
  //     this.owlEl.style.cursor = 'grab';
  //   }
  // }
  
  // @HostListener('mousemove', ['$event'])
  // onMouseMove(event: MouseEvent): void {
  //   if (this.isPressing && !this.isMoving) {
  //     // Detect the movement and handle swipe (or pan) logic here.
  //     const deltaX = event.clientX - this.startX;
  //     const deltaY = event.clientY - this.startY;
  //     if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
  //       this.isMoving = true;
  //     }
  //   }
  // }
  
  // @HostListener('touchstart', ['$event'])
  // onTouchStart(event: TouchEvent): void {
  //   const touch = event.touches[0];
  //   this.isPressing = true;
  //   this.startX = touch.clientX;
  //   this.startY = touch.clientY;
  //   this.owlEl.style.cursor = 'grabbing';
  // }
  
  // @HostListener('touchend')
  // onTouchEnd(): void {
  //   if (this.isPressing) {
  //     this.isPressing = false;
  //     this.isMoving = false;
  //     this.owlEl.style.cursor = 'grab';
  //   }
  // }
  
  // @HostListener('touchmove', ['$event'])
  // onTouchMove(event: TouchEvent): void {
  //   if (this.isPressing && !this.isMoving) {
  //     const touch = event.touches[0];
  //     const deltaX = touch.clientX - this.startX;
  //     const deltaY = touch.clientY - this.startY;
  //     if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
  //       this.isMoving = true;
  //     }
  //   }
  // }
}