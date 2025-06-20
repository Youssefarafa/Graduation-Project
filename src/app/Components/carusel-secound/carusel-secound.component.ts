// import {
//   AfterViewInit,
//   ChangeDetectorRef,
//   Component,
//   ElementRef,
//   HostListener,
//   OnInit,
//   ViewChild,
// } from '@angular/core';
// import { PlatformDetectionService } from '../../core/services/platform-detection.service';
// import { CategoriesService } from '../../core/services/categories.service';
// import {
//   CarouselComponent,
//   CarouselModule,
//   OwlOptions,
// } from 'ngx-owl-carousel-o';
// import { NgOptimizedImage } from '@angular/common';

// @Component({
//   selector: 'app-carusel-secound',
//   standalone: true,
//   imports: [CarouselModule, NgOptimizedImage],
//   templateUrl: './carusel-secound.component.html',
//   styleUrl: './carusel-secound.component.scss',
// })
// export class CaruselSecoundComponent implements OnInit, AfterViewInit {
//   categories?: any[] = [];
//   constructor(
//     private platformDetectionService: PlatformDetectionService,
//     private _CategoriesShopService: CategoriesService
//   ) {}

//   ngOnInit() {
//     if (this.platformDetectionService.isBrowser) {
//       console.log('Running in the browser');

//       // Load Flowbite dynamically
//       this.platformDetectionService.loadFlowbite((flowbite) => {
//         flowbite.initFlowbite();
//         console.log('Flowbite loaded successfully');
//       });

//       // Access the DOM safely after rendering
//       this.platformDetectionService.executeAfterDOMRender(() => {
//         this.getCategores();
//       });
//     }
//   }

//   getCategores = () => {
//     this._CategoriesShopService.getcategories().subscribe({
//       next: (res) => {
//         this.categories = res.data;
//       },
//       error: (err) => {
//         console.error('Error fetching categories:', err);
//       },
//       complete: () => {
//         console.log('categories fetching complete');
//       },
//     });
//   };

  // customOptions2: OwlOptions = {
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
  //       items: 2,
  //       center: false,
  //     },
  //     400: {
  //       items: 2,
  //       center: false,
  //     },
  //     740: {
  //       items: 4,
  //       center: false,
  //     },
  //     940: {
  //       items: 8,
  //       center: false,
  //     },
  //   },
  //   nav: false, // Disable navigation arrows
  //   margin: 10, // Set margin between items
  //   autoplay: true, // Enable autoplay
  //   autoplayTimeout: 1500, // Decrease timeout to 1 second (1000ms) for smoother transition
  //   autoplaySpeed: 1200, // Set autoplay speed to 300ms for smooth transition
  //   smartSpeed: 1000,
  //   autoplayHoverPause: true,
  // };

  // owlEl1: any;
  // @ViewChild('carouselRef1', { static: true }) carouselRef1!: CarouselComponent;
  // @ViewChild('carouselRef1', { read: ElementRef }) carouselElRef1!: ElementRef;
  // @ViewChild('DivParentOfCarousel1')
  // DivParentOfCarousel1!: ElementRef<HTMLElement>;

  // ngAfterViewInit() {
  //   this.owlEl1 =
  //     this.carouselElRef1.nativeElement.querySelector('.owl-carousel');
  //   this.DivParentOfCarousel1.nativeElement.addEventListener(
  //     'mouseleave',
  //     () => {
  //       this.owlEl1.style.cursor = 'default';
  //     }
  //   );
  //   let isThrottled1 = false;
  //   const throttleDelay1 = 800;
  //   if (this.owlEl1) {
  //     this.owlEl1.addEventListener(
  //       'wheel',
  //       (event: WheelEvent) => {
  //         this.owlEl1.style.cursor = 'default';
  //         const absX = Math.abs(event.deltaX);
  //         const absY = Math.abs(event.deltaY);
  //         // if horizontal scroll is stronger than vertical…
  //         if (absX > absY) {
  //           // prevent the page from also scrolling vertically
  //           event.preventDefault();
  //           // throttle so you don’t fire too many carousel moves
  //           if (isThrottled1) return;
  //           isThrottled1 = true;
  //           setTimeout(() => (isThrottled1 = false), throttleDelay1);
  //           // move carousel
  //           if (event.deltaX < 0) {
  //             (this.carouselRef1 as any).prev();
  //           } else {
  //             (this.carouselRef1 as any).next();
  //           }
  //         }
  //       },
  //       { passive: false }
  //     );
  //   }
  // }

  // private isPressing1 = false;
  // private startX1 = 0;
  // private startY1 = 0;
  // private isMoving1 = false;

  // @HostListener('mousedown', ['$event'])
  // onMouseDown1(event: MouseEvent): void {
  //   this.isPressing1 = true;
  //   this.startX1 = event.clientX;
  //   this.startY1 = event.clientY;
  //   this.owlEl1.style.cursor = 'grabbing';
  // }

  // @HostListener('mouseup')
  // onMouseUp1(): void {
  //   if (this.isPressing1) {
  //     this.isPressing1 = false;
  //     this.isMoving1 = false;
  //     this.owlEl1.style.cursor = 'grab';
  //   }
  // }

  // @HostListener('mousemove', ['$event'])
  // onMouseMove1(event: MouseEvent): void {
  //   if (this.isPressing1 && !this.isMoving1) {
  //     // Detect the movement and handle swipe (or pan) logic here.
  //     const deltaX = event.clientX - this.startX1;
  //     const deltaY = event.clientY - this.startY1;
  //     if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
  //       this.isMoving1 = true;
  //     }
  //   }
  // }

  // @HostListener('touchstart', ['$event'])
  // onTouchStart1(event: TouchEvent): void {
  //   const touch = event.touches[0];
  //   this.isPressing1 = true;
  //   this.startX1 = touch.clientX;
  //   this.startY1 = touch.clientY;
  //   this.owlEl1.style.cursor = 'grabbing';
  // }

  // @HostListener('touchend')
  // onTouchEnd1(): void {
  //   if (this.isPressing1) {
  //     this.isPressing1 = false;
  //     this.isMoving1 = false;
  //     this.owlEl1.style.cursor = 'grab';
  //   }
  // }

  // @HostListener('touchmove', ['$event'])
  // onTouchMove1(event: TouchEvent): void {
  //   if (this.isPressing1 && !this.isMoving1) {
  //     const touch = event.touches[0];
  //     const deltaX = touch.clientX - this.startX1;
  //     const deltaY = touch.clientY - this.startY1;
  //     if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
  //       this.isMoving1 = true;
  //     }
  //   }
  // }
// }

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { CategoriesService } from '../../core/services/categories.service';
import { NgOptimizedImage } from '@angular/common';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carusel-secound',
  standalone: true,
  imports: [NgOptimizedImage,RouterLink],
  templateUrl: './carusel-secound.component.html',
  styleUrl: './carusel-secound.component.scss',
})
export class CaruselSecoundComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  categories: any[] = [];
  constructor(
    private platformDetectionService: PlatformDetectionService,
    private _ProductsShopService: ProductsShopService,
    private cdr: ChangeDetectorRef
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
        this.getCategories();
      });
    }
  }

  getCategories = () => {
    this._ProductsShopService.getBestproducts().subscribe({
      next: (res) => {
        this.categories = [...res.data, ...res.data]; // duplicate list
        this.cdr.detectChanges();
        const carousel = this.carouselRef1.nativeElement;
        this.wrapWidth = carousel.scrollWidth - carousel.clientWidth;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
      complete: () => {
        console.log('categories fetching complete');
      },
    });
  };

  // these refs match the new template:
  @ViewChild('carouselRef1', { static: true })
  carouselRef1!: ElementRef<HTMLElement>;
  @ViewChild('DivParentOfCarousel1')
  DivParentOfCarousel1!: ElementRef<HTMLElement>;

  private isUserInteracting = false; // 👈 add this flag
  private interactionTimeoutId: ReturnType<typeof setTimeout> | null = null; // 👈 to store timeout ID
  // manual scroll state
  private offset = 0;
  private wrapWidth = 0;
  private animId!: number;
  private isPressing1 = false;
  private startX1 = 0;
  private currentOffset1 = 0;

  ngAfterViewInit() {
    this.startAutoScroll();
    const parent = this.DivParentOfCarousel1.nativeElement;
    parent.addEventListener('mouseenter', () => {
      this.stopAutoScroll();
    });
    parent.addEventListener('mouseleave', () => {
      if (!this.isUserInteracting) {
        // ✅ only restart if user is not interacting
        this.startAutoScroll();
      }
      parent.style.cursor = 'default';
    });
    let isThrottled = false;
    const throttleDelay = 800;
    parent.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        const absX = Math.abs(e.deltaX),
          absY = Math.abs(e.deltaY);
        if (absX > absY) {
          e.preventDefault();
          if (isThrottled) return;
          isThrottled = true;
          setTimeout(() => (isThrottled = false), throttleDelay);
          this.stopAutoScroll();
          this.isUserInteracting = true;
          const scrollAmount = 200;
          if (e.deltaX < 0) {
            this.offset -= scrollAmount;
          } else {
            this.offset += scrollAmount;
          }
          const carouselWidth = this.carouselRef1.nativeElement.scrollWidth / 2;
          // 🛠 Wrap offset instead of clamping
          // if (this.offset < 0) {
          //   this.offset = 0;
          // } else if (this.offset > carouselWidth) {
          //   this.offset = carouselWidth;
          // }
          const halfListWidth =
            this.carouselRef1.nativeElement.scrollWidth / 2 -
            this.DivParentOfCarousel1.nativeElement.clientWidth;
          this.offset = Math.max(0, Math.min(this.offset, halfListWidth));
          this.carouselRef1.nativeElement.style.transition =
            'transform 0.3s ease';
          this.carouselRef1.nativeElement.style.transform = `translateX(-${this.offset}px)`;
          this.resetInteractionTimeout();
        }
      },
      { passive: false }
    );
    parent.addEventListener(
      'touchstart',
      (event: TouchEvent) => {
        const touch = event.touches[0];
        this.isPressing1 = true;
        this.startX1 = touch.clientX;
        this.currentOffset1 = this.offset;
        parent.style.cursor = 'grabbing';
        this.stopAutoScroll();
        this.isUserInteracting = true; // 🚩
      },
      { passive: false }
    );
    parent.addEventListener(
      'touchmove',
      (event: TouchEvent) => {
        if (!this.isPressing1) return;
        event.preventDefault();
        const touch = event.touches[0];
        const deltaX = this.startX1 - touch.clientX;
        this.offset = this.currentOffset1 + deltaX;
        const carouselWidth = this.carouselRef1.nativeElement.scrollWidth / 2; // half because duplicated
        // 🛠 Wrap offset instead of clamping
        // if (this.offset < 0) {
        //   this.offset += carouselWidth;
        // } else if (this.offset > carouselWidth) {
        //   this.offset -= carouselWidth;
        // }
        const halfListWidth =
          this.carouselRef1.nativeElement.scrollWidth / 2 -
          this.DivParentOfCarousel1.nativeElement.clientWidth;
        this.offset = Math.max(0, Math.min(this.offset, halfListWidth));
        this.carouselRef1.nativeElement.style.transition = 'none';
        this.carouselRef1.nativeElement.style.transform = `translateX(-${this.offset}px)`;
      },
      { passive: false }
    );
    parent.addEventListener('touchend', () => {
      if (this.isPressing1) {
        this.isPressing1 = false;
        parent.style.cursor = 'grab';
        this.resetInteractionTimeout(); // 🚩 restart auto-scroll after delay
      }
    });
  }

  stopAutoScroll() {
    cancelAnimationFrame(this.animId);
  }

  resetInteractionTimeout() {
    if (this.interactionTimeoutId) {
      clearTimeout(this.interactionTimeoutId);
    }
    this.interactionTimeoutId = setTimeout(() => {
      this.isUserInteracting = false;
      this.startAutoScroll();
    }, 2000); // wait 2s after last interaction
  }

  startAutoScroll() {
    cancelAnimationFrame(this.animId);
    const speed = 2.3; // Smoother fractional speed
    const scroll = () => {
      const carousel = this.carouselRef1.nativeElement;
      const carouselWidth = carousel.scrollWidth / 2; // because duplicated
      this.offset += speed;
      if (this.offset >= carouselWidth) {
        this.offset = 0;
        // reset transform with no animation
        carousel.style.transform = `translateX(0px)`;
        carousel.style.transition = 'none';
        // Force reflow to flush style
        void carousel.offsetWidth;
      }
      // apply transform without transition
      carousel.style.transform = `translateX(-${this.offset}px)`;
      carousel.style.transition = 'none';
      this.animId = requestAnimationFrame(scroll);
    };
    this.animId = requestAnimationFrame(scroll);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    if (this.interactionTimeoutId) {
      clearTimeout(this.interactionTimeoutId);
    }
  }
}
