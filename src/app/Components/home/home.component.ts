import { AuthService } from '../../core/services/auth.service';
import { Component, ElementRef, OnDestroy, AfterViewInit, OnInit,effect,signal,computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarService } from '../../core/services/navbar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('cardAnim', [
      state('hidden', style({ transform: 'translateY(30px)', opacity: 0 })),
      state('visible', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('hidden => visible', animate('600ms ease-out'))
    ]),
    trigger('fadeInStagger', [
      transition(':enter', [
        query('.testimonial-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(200, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ])
        ])
      ])
    ]),
    trigger('fadeUpTitle', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('1s', style({ opacity: 1 }))]),
    ]),
    trigger('slideFade', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('600ms ease-out')]),
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _NavbarService = inject(NavbarService);
  cards = [
    { img: 'assets/Images/images/1.png', title: 'Plants Store', text: 'The store offers a wide variety of plants and agricultural tools.' },
    { img: 'assets/Images/images/2.png', title: 'Powerful AI Models', text: 'Reliable AI-powered plant disease diagnosis and weed detection system to support farmers worldwide!' },
    { img: 'assets/Images/images/3.png', title: 'Your AI Assistant', text: 'Ask questions and receive articles using our AI assistant.' },
    { img: 'assets/Images/images/4.png', title: 'Easy Returns', text: "Returning purchases is simple and hassle-free with our easy return options." },
    { img: 'assets/Images/images/5.png', title: '100% Satisfaction', text: 'We ensure top-quality products and service to guarantee your complete satisfaction.' },
    { img: 'assets/Images/images/6.png', title: 'Great Daily Deal', text: 'Enjoy amazing discounts and special offers every day on your favorite plants and tools.' }
  ];
  images = [
    'assets/Images/images/Slid1.png',
    'assets/Images/images/13.png',
    'assets/Images/images/Slid3.png',
    'assets/Images/images/home.png',
    'assets/Images/images/12.png',
    'assets/Images/images/111jpg.jpg',
  ];
  owlConfig = {
    loop: true,
    margin: 10,
    center: true,
    autoplay: true,
    autoplayTimeout: 5000,
    smartSpeed: 1000,
    mouseDrag:false,
    touchDrag:false,
    pullDrag:false,
    dots:false,
    responsive: {
      0: {
        items: 3,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 3,
      },
    },
  };
  customer = [
    {
      namee: 'Ahmed Hamdy',
      cont: '"I would recommend practitioners at this center to everyone! They are great to work with and are excellent trainers. Thank you all!"',
      str:Array(5)
    },
    {
      namee: 'Mostafa Ashraf',
      cont: '"A truly unique experience! The support I received exceeded all expectations. My plants have never been healthier."',
      str:Array(4)
    },
    {
      namee: 'Youssef Kamal',
      cont: '"Professional, knowledgeable, and friendly. They provided great advice that really helped improve my garden."',
      str:Array(5)
    },
    {
      namee: 'Mohannad Hamdy',
      cont: '"Professional, knowledgeable, and friendly. They provided great advice that really helped improve my garden."',
      str:Array(5)
    }
  ];
  
  rotateImages(): void {
    const [first, ...rest] = this.images;
    this.mainImage.set(first);
    this.images = [...rest, this.mainImage()];
  }

  handleBeforeChange(event: any): void {
    const centerIndex = event.startPosition + 2; // middle of 3 items
    const centeredImage = this.images[centerIndex % this.images.length];
    this.mainImage.set(centeredImage);
  }
  mainImage = signal('assets/Images/images/home.png');
  observer!: IntersectionObserver;
  inView1 = false;
  inView = false;
  // stars = Array(4);
  constructor(private token: AuthService,private elRef: ElementRef,private PlatformDetectionService: PlatformDetectionService) {
    this.token.saveUserData();
  }
  ngOnInit() {
    if (this.PlatformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this.PlatformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this.PlatformDetectionService.executeAfterDOMRender(() => {
        this._NavbarService.isOurteam=false;
        this.observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) this.inView1 = true;
          },
          { threshold: 0.1 }
        );
        this.observer.observe(this.elRef.nativeElement);

        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                this.inView = true;
                observer.disconnect();
              }
            },
            { threshold: 0.2 }
          );
    
          observer.observe(this.elRef.nativeElement);
        }
        setInterval(() => this.rotateImages(), 5000);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }

  getCardState(index: number): string {
    return this.inView1 ? 'visible' : 'hidden';
  }

}
