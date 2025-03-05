import { Component, ElementRef, HostListener  } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidbar-shop',
  standalone: true,
  imports: [NgClass, NgIf,RouterLink, RouterLinkActive],
  templateUrl: './sidbar-shop.component.html',
  styleUrl: './sidbar-shop.component.scss'
})
export class SidbarShopComponent {
  isOpen = false;
  constructor(private eRef: ElementRef) {}
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  // Close sidebar when clicking outside of it
  @HostListener('document:click', ['$event'])
  closeSidebar(event: Event) {
    if (this.isOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
  // Close sidebar when clicking on a link
  closeOnLinkClick() {
    this.isOpen = false;
  }
}
