import { RouterLink, NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  existingClass: { [key: string]: boolean } = {
    'shadow-[inset_0px_10px_27px_-10px_rgba(0,0,0,0.56)]': true,
    'bg-gradient-to-t': true,
    'from-[#238564]': true,
    'from-40%': true,
    'via-[#238564]': true,
    'via-1%': true,
    'to-[#00F9A6]': true,
    'dark:from-[#78350f]': true,
    // 'dark:via-[#1b5a45]': true,
    'dark:to-[#d97706]': true,
    'to-59%': true,
    'px-2': true,
    'sm:px-4': true,
    'md:px-10': true,
    'lg:px-8': true,
    'lx:px-16': true,
    'text-white': true,
    'ms-16': false, // Initially not applied
  };

  constructor(
    private router: Router,
    private platformDetectionService: PlatformDetectionService
  ) {}

  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      this.platformDetectionService.executeAfterDOMRender(() => {
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.updateClasses(event.url);
          }
        });
      });
    }
  }

  updateClasses(url: string) {
    const shopRoutes = [
      '/User/Shop/Products',
      '/User/Shop/CartShop',
      '/User/Shop/WishList',
      '/User/Shop/Categories',
      '/User/Shop',
      '/User'
    ];
    this.existingClass['ms-16'] = shopRoutes.includes(url);
  }
  
}
