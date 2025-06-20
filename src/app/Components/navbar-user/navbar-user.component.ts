import {
  Component,
  inject,
  OnInit,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { NavbarService } from '../../core/services/navbar.service';
import { CartService } from '../../core/services/cart.service';
// import { Router, NavigationEnd } from '@angular/router';
// import { initDropdowns } from 'flowbite';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.scss',
})
export class NavbarUserComponent implements OnInit {
  private readonly _isDarkMode = inject(NavbarService);
  private readonly _Router = inject(Router);
  private readonly _CartService = inject(CartService);
  isDarkMode = false;
  name:string=JSON.parse(localStorage.getItem('register')?? '').fName+ ' ' + JSON.parse(localStorage.getItem('register')?? '').lName
  email:string=JSON.parse(localStorage.getItem('register')?? '').email
  userphoto:any='./assets/Images/userimage.png';
  photoProfile:any;
  constructor(
    private platformDetectionService: PlatformDetectionService,
    private renderer: Renderer2,
    // private router: Router
  ) {}

  closeDropdown() {
    const dropdown = document.getElementById('dropdownRight');
    dropdown?.classList.add('hidden');  // Hide it manually
  }

  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite (Independent of Dark Mode)
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Apply dark mode settings after DOM renders
      this.platformDetectionService.executeAfterDOMRender(() => {
        this.setupDarkMode();
        // Subscribe to the dark mode state from NavbarService
        this._isDarkMode.isDarkMode$.subscribe((darkModeState) => {
          this.isDarkMode = darkModeState; // Update local state
          this.applyTheme(); // Apply theme based on updated state
        });
        if(JSON.parse(localStorage.getItem('register')?? '').userPictureUrl.includes('http://naptaapi.runasp.net')){
          localStorage.setItem('profileImage', JSON.parse(localStorage.getItem('register')?? '').userPictureUrl);
        }else{
          localStorage.setItem('profileImage', 'http://naptaapi.runasp.net'+JSON.parse(localStorage.getItem('register')?? '').userPictureUrl);
        }
        this._isDarkMode.FunCallFromAccount();
        this._isDarkMode.photoProfile.subscribe(photo => {
        this.userphoto = photo;
        console.log(this.userphoto);
        if(this.userphoto){
          this.photoProfile =this.userphoto;
        }else{
          this.photoProfile ='./assets/Images/userimage.png';
        }
        });
      });
    }
  }

  setupDarkMode() {
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.isDarkMode = systemPrefersDark;
    this._isDarkMode.setDarkMode(this.isDarkMode);
    this.applyTheme();

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        this.isDarkMode = event.matches;
        this._isDarkMode.setDarkMode(this.isDarkMode);
        this.applyTheme();
      });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this._isDarkMode.setDarkMode(this.isDarkMode);
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  Signout(){
    this._isDarkMode.FunCallFromNavBarUser();
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }    
    if (localStorage.getItem('profileImage')) {
      localStorage.removeItem('profileImage');
    }  
    // if (localStorage.getItem('register')) {
    //   localStorage.removeItem('register');
    // } 
    this._CartService.counterCart.next(0)
    this._Router.navigate([`/Start/Home`]);
  }
}
