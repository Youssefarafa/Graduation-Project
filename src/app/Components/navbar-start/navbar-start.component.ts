import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../core/services/flowbite.service';

@Component({
  selector: 'app-navbar-start',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar-start.component.html',
  styleUrl: './navbar-start.component.scss',
})
export class NavbarStartComponent implements OnInit {
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
      // console.log('Flowbite loaded', flowbite);
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
