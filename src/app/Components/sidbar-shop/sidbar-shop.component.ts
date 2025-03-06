import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';

@Component({
  selector: 'app-sidbar-shop',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidbar-shop.component.html',
  styleUrl: './sidbar-shop.component.scss',
})
export class SidbarShopComponent implements OnInit {
  isOpen = false;

  constructor(
    private eRef: ElementRef,
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
