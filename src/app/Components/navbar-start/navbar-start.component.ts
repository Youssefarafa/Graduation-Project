import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { NavbarService } from '../../core/services/navbar.service';
import { filter } from 'rxjs/operators';
import { Event as RouterEvent } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-navbar-start',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar-start.component.html',
  styleUrl: './navbar-start.component.scss',
})
export class NavbarStartComponent implements OnInit {
  private readonly _isDarkMode = inject(NavbarService);
  private _cdr = inject(ChangeDetectorRef);
  isDarkMode = false;
  isOurTeam = false;
  isHome = false;
  constructor(
    private platformDetectionService: PlatformDetectionService,
    private renderer: Renderer2,
    private router: Router
  ) {}
  private spinner = inject(NgxSpinnerService);
  // track last URL so we can skip repeats
  private lastUrl: string | null = null;

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
        this.router.events.subscribe((event: RouterEvent) => {
          // 1) only care about NavigationStart
          if (event instanceof NavigationStart) {
            this.spinner.show('register');
            setTimeout(() => {
              // 2) skip if navigating to the same URL
              if (event.url === this.lastUrl) {
                this.spinner.hide('register');
                return;
              }
              this.lastUrl = event.url;
              // 3) now it’s a *new* navigation start → show spinner & update flag
              this.isOurTeam = event.url.includes('OurTeam');
              // if you’re OnPush
              this._cdr.detectChanges();
            }, 1000);
          }
        });
        // 2) HIDE spinner on NavigationEnd / Cancel / Error
        this.router.events
          .pipe(
            filter(
              (e): e is NavigationEnd | NavigationCancel | NavigationError =>
                e instanceof NavigationEnd ||
                e instanceof NavigationCancel ||
                e instanceof NavigationError
            )
          )
          .subscribe(() => {
            setTimeout(() => {
              this.spinner.hide('register');
            }, 1000);
            this._cdr.detectChanges();
          });

        // this.router.events
        // .subscribe((event: RouterEvent) => {
        //   // 3) Manually check for NavigationEnd
        //   this.spinner.show('register');
        //   setTimeout(()=>{
        //     if (event instanceof NavigationStart) {
        //       const navStart = event as NavigationStart;
        //       this.isOurTeam = navStart.url.includes('OurTeam');
        //     }
        //     setTimeout(() => {
        //       this.spinner.hide('register');
        //       this._cdr.detectChanges();
        //     }, 1000);
        //   },2000)
        // });

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
