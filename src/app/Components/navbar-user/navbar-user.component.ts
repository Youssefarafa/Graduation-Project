import {
  Component,
  inject,
  OnInit,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { NavbarService } from '../../core/services/navbar.service';
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
  isDarkMode = false;

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
}
