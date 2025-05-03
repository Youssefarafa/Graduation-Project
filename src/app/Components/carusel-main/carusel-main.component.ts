import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
} from 'ngx-owl-carousel-o';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';

@Component({
  selector: 'app-carusel-main',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './carusel-main.component.html',
  styleUrl: './carusel-main.component.scss',
})
export class CaruselMainComponent implements OnInit, AfterViewInit {
  constructor(private platformDetectionService: PlatformDetectionService) {}
  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this.platformDetectionService.executeAfterDOMRender(() => {});
    }
  }

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

  owlEl: any;
  @ViewChild('carouselRef', { static: true }) carouselRef!: CarouselComponent;
  @ViewChild('carouselRef', { read: ElementRef }) carouselElRef!: ElementRef;
  @ViewChild('DivParentOfCarousel')
  DivParentOfCarousel!: ElementRef<HTMLElement>;
  ngAfterViewInit() {
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

  private isPressing = false;
  private startX = 0;
  private startY = 0;
  private isMoving = false;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isPressing = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.owlEl.style.cursor = 'grabbing';
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
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.isPressing = true;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.owlEl.style.cursor = 'grabbing';
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
}
