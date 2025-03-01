import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initAccordions, initFlowbite } from 'flowbite';
// import { Analytics, logEvent } from '@angular/fire/analytics';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './Components/footer/footer.component';
import { NotfoundComponent } from './Components/notfound/Notfound.component';
import { UserComponent } from './Layouts/user/user.component';
import { AdminComponent } from './Layouts/admin/admin.component';
import { StartComponent } from './Layouts/start/start.component';
// import { getAuth } from "firebase/auth";
// mport { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  title = 'Project';
  // private analytics = inject(Analytics);

  // constructor() {
  //   // Log an event
  //   this.analytics.logEvent('app_started', { component: 'AppComponent' });
  // }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initAccordions(); // Call your function ONLY in the browser
      initFlowbite();
    }
  }
}
