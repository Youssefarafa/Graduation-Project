import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.scss'
})
export class NavbarAdminComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) {}
  isDarkMode = false;
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.isDarkMode = systemPrefersDark;
      // Apply the initial theme
      this.applyTheme();
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
          this.isDarkMode = event.matches;
          this.applyTheme();
        });
      console.log('Flowbite loaded', flowbite);
    });
    initFlowbite(); // Call the dropdown initialization function
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }
  applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  // ngAfterViewInit() {
    
  // }
}
