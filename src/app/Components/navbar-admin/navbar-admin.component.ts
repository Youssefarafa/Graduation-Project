import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.scss'
})
export class NavbarAdminComponent implements OnInit {
  isDarkMode = false;

  constructor(
    private platformDetectionService: PlatformDetectionService,
    private renderer: Renderer2
  ) {}

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
      });
    }
  }

  setupDarkMode() {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode = systemPrefersDark;
    this.applyTheme();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      this.isDarkMode = event.matches;
      this.applyTheme();
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
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
