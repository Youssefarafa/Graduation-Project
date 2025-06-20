import { Component, HostListener, OnInit } from '@angular/core';
import { PlatformDetectionService } from './core/services/platform-detection.service';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './Components/footer/footer.component';
import { NotfoundComponent } from './Components/notfound/Notfound.component';
import { UserComponent } from './Layouts/user/user.component';
import { AdminComponent } from './Layouts/admin/admin.component';
import { StartComponent } from './Layouts/start/start.component';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NgIf } from '@angular/common';

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
    NgxSpinnerComponent,NgIf
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
      this.PlatformDetectionService.executeAfterDOMRender(() => {});
    }
  }
  onContainerDragOverDragLeaveDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'none'; // 🚫 Not allowed
  }

  ToUp() {
    window.scrollTo(0, 0);
  }

  showButton = false;
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.showButton = window.scrollY > 70; // Show if not at top
  }



  HackWishList(){
    localStorage.setItem('wishlist',`[{"id":99,"name":"Artichoke Green Globe Seeds","description":"Perennial vegetable with edible flower buds. Requires a long growing season.","price":4.95,"pictureUrl":"http://naptaapi.runasp.net/images/products/image99.jpg","typeId":2,"typeName":"Agricultural Seeds Of All Kinds","count":100,"rate":4.5,"morePicturesList":[]},{"id":105,"name":"Areca Palm","description":"The Areca Palm brings a lush, tropical atmosphere to indoor and patio spaces with its feathery, arching fronds. It's a pet-friendly plant that can grow tall indoors, acting as a natural humidifier. This low-maintenance palm prefers indirect light and regular watering, making it a charming addition to any modern or tropical-themed decor.","price":19.99,"pictureUrl":"http://naptaapi.runasp.net/images/products/image105.jpg","typeId":3,"typeName":"Ornamental Plants Products","count":55,"rate":4.5,"morePicturesList":["http://naptaapi.runasp.net/images/products/image105sub1.jpg","http://naptaapi.runasp.net/images/products/image105sub2.jpg","http://naptaapi.runasp.net/images/products/image105sub3.jpg","http://naptaapi.runasp.net/images/products/image105sub4.jpg"]},{"id":33,"name":"Aphid Control Liquid","description":"Designed to assist in efficient and precise work in the garden. Helps reduce strain and improves productivity. Suitable for use in all types of garden environments including indoors, greenhouses, and outdoors.","price":10.12,"pictureUrl":"http://naptaapi.runasp.net/images/products/image33.jpg","typeId":1,"typeName":"Tools Plants Products","count":81,"rate":2.8,"morePicturesList":["http://naptaapi.runasp.net/images/products/image33sub1.jpg","http://naptaapi.runasp.net/images/products/image33sub2.jpg","http://naptaapi.runasp.net/images/products/image33sub3.jpg"]},{"id":38,"name":"Adjustable Plant Ties","description":"Natural and safe solution ideal for controlling pests and diseases in edible and ornamental plants. Ensures eco-friendly treatment. Suitable for use in all types of garden environments including indoors, greenhouses, and outdoors.","price":13.26,"pictureUrl":"http://naptaapi.runasp.net/images/products/image38.jpg","typeId":1,"typeName":"Tools Plants Products","count":91,"rate":4.1,"morePicturesList":["http://naptaapi.runasp.net/images/products/image38sub1.jpg","http://naptaapi.runasp.net/images/products/image38sub2.jpg","http://naptaapi.runasp.net/images/products/image38sub3.jpg"]},{"id":121,"name":"African Violet","description":"African Violets are known for their colorful and abundant blooms, adding a splash of color to any indoor space. These small, compact plants thrive in bright, indirect light and require regular watering. They're perfect for windowsills, shelves, or small tables, and with the right care, they can bloom year-round.","price":9.99,"pictureUrl":"http://naptaapi.runasp.net/images/products/image121.jpg","typeId":3,"typeName":"Ornamental Plants Products","count":80,"rate":4.7,"morePicturesList":["http://naptaapi.runasp.net/images/products/image121sub1.jpg","http://naptaapi.runasp.net/images/products/image121sub2.jpg","http://naptaapi.runasp.net/images/products/image121sub3.jpg","http://naptaapi.runasp.net/images/products/image121sub4.jpg"]},{"id":104,"name":"Aloe Vera Plant","description":"A multipurpose succulent, Aloe Vera is prized both for its attractive rosette of thick, spiky leaves and the healing gel inside them. Known for its medicinal and skincare benefits, this plant is a staple in homes for its utility and minimal care needs. It thrives in sunny spots and requires very little watering.","price":8.99,"pictureUrl":"http://naptaapi.runasp.net/images/products/image104.jpg","typeId":3,"typeName":"Ornamental Plants Products","count":90,"rate":4.7,"morePicturesList":["http://naptaapi.runasp.net/images/products/image104sub1.jpg","http://naptaapi.runasp.net/images/products/image104sub2.jpg","http://naptaapi.runasp.net/images/products/image104sub3.jpg","http://naptaapi.runasp.net/images/products/image104sub4.jpg"]},{"id":66,"name":"Beet Detroit Dark Red Seeds","description":"Heirloom beet variety with sweet, deep red roots`)
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
