import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      return auth; // No need for emulator in production or development with real Firebase
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      return firestore;
    }),
    CookieService,
    provideRouter(
      routes,
      withViewTransitions(),
      withHashLocation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideClientHydration(),
    // importProvidersFrom(HttpClientModule),
    provideHttpClient(withFetch()),
  ],
};
