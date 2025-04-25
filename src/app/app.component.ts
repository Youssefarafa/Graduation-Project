import { Component, OnInit } from '@angular/core';
import { PlatformDetectionService } from './core/services/platform-detection.service';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './Components/footer/footer.component';
import { NotfoundComponent } from './Components/notfound/Notfound.component';
import { UserComponent } from './Layouts/user/user.component';
import { AdminComponent } from './Layouts/admin/admin.component';
import { StartComponent } from './Layouts/start/start.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    NotfoundComponent,
    UserComponent,
    AdminComponent,
    StartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private PlatformDetectionService: PlatformDetectionService) {}

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
        
      });
    }
  }
  onContainerDragOverDragLeaveDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'none'; // 🚫 Not allowed
  }
}

// import {
//   Component,
//   Inject,
//   OnInit,
//   PLATFORM_ID,
//   Renderer2,
// } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { initAccordions, initFlowbite } from 'flowbite';
// import { RouterOutlet } from '@angular/router';
// import { FooterComponent } from './Components/footer/footer.component';
// import { NotfoundComponent } from './Components/notfound/Notfound.component';
// import { UserComponent } from './Layouts/user/user.component';
// import { AdminComponent } from './Layouts/admin/admin.component';
// import { StartComponent } from './Layouts/start/start.component';
// import { FlowbiteService } from './core/services/flowbite.service';
// import { BrowserDetectionService } from './core/services/browser-detection.service';
// // import { Analytics, logEvent } from '@angular/fire/analytics';
// // import { getAuth } from "firebase/auth";
// // mport { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     FooterComponent,
//     NotfoundComponent,
//     UserComponent,
//     AdminComponent,
//     StartComponent,
//   ],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss',
// })
// export class AppComponent implements OnInit {
//   isBrowser: boolean;

//   constructor(private browserService: BrowserDetectionService) {
//     this.isBrowser = this.browserService.isBrowser;

//     if (this.isBrowser) {
//       console.log('This is running in the browser');
//     }
//   }

//   ngOnInit() {
//     if (this.browserService.isBrowser) {
//       setTimeout(() => {
//         console.log(document.getElementById('someId'));
//       }, 0);
//     }

//   // constructor(
//   //   @Inject(PLATFORM_ID) private platformId: any,
//   //   private flowbiteService: FlowbiteService
//   // ) {}
//   // title = 'Project';
//   // // private analytics = inject(Analytics);
//   // // constructor() {
//   // //   // Log an event
//   // //   this.analytics.logEvent('app_started', { component: 'AppComponent' });
//   // // }

//   // ngOnInit(): void {
//   //   this.flowbiteService.loadFlowbite((flowbite) => {
//   //     // Your custom code here
//   //   });
//   //   if (isPlatformBrowser(this.platformId)) {
//   //     initAccordions(); // Call your function ONLY in the browser
//   //     initFlowbite();
//   //   }
//   }
// }

// import { Component, OnInit, HostListener } from '@angular/core';
// import { FlowbiteService } from '../../core/services/flowbite.service';
// import { NgClass } from '@angular/common';

// @Component({
//   selector: 'app-com1',
//   standalone: true,
//   imports: [NgClass],
//   templateUrl: './com1.component.html',
//   styleUrl: './com1.component.scss',
// })
// export class Com1Component implements OnInit {
//   constructor(private flowbiteService: FlowbiteService) {}
//   isNavbarOpen = false;
//   ngOnInit(): void {
//     this.flowbiteService.loadFlowbite((flowbite) => {
//       // Your custom code here
//       this.updateActiveSection();
//       console.log('Flowbite loaded', flowbite);
//     });
//   }
//   toggleNavbar(): void {
//     this.isNavbarOpen = !this.isNavbarOpen;
//   }
//   @HostListener('window:scroll', [])
//   onScroll(): void {
//     this.updateActiveSection();
//   }
//   scrollToSection(sectionId: string): void {
//     const section = document.getElementById(sectionId);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       this.isNavbarOpen = false;
//     }
//   }
//   private updateActiveSection(): void {
//     const sections = document.querySelectorAll('section');
//     let currentSection = '';

//     sections.forEach((section) => {
//       const sectionTop = section.getBoundingClientRect().top + window.scrollY;
//       if (window.scrollY >= sectionTop - 60) {
//         currentSection = section.getAttribute('id')!;
//       }
//     });

//     document.querySelectorAll('.nav-link').forEach((button) => {
//       button.classList.remove('text-blue-500', 'font-bold');
//     });

//     if (currentSection) {
//       const activeButton = document.getElementById(`btn-${currentSection}`);
//       if (activeButton) {
//         activeButton.classList.add('text-blue-500', 'font-bold');
//       }
//     }
//   }
// }
