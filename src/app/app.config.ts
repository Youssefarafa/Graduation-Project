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
  withInterceptors,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { headersInterceptor } from './core/interceptor/headers.interceptor';
import { errorsInterceptor } from './core/interceptor/errors.interceptor';
import { loadingInterceptor } from './core/interceptor/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // required animations providers
    provideToastr({
      preventDuplicates:true,
      countDuplicates:true,
      resetTimeoutOnDuplicate:true,
      includeTitleDuplicates:true,
      timeOut: 3500,
      progressBar: true,
      closeButton: true,
      tapToDismiss: false
    }), // Toastr providers
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
    provideHttpClient(withFetch(),withInterceptors([loadingInterceptor])), //?  ,withInterceptors([headersInterceptor,errorsInterceptor,loadingInterceptor])
  ],
};
