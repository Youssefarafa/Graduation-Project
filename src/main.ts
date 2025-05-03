import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Router } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
// import { environment } from './environments/environment';
// getauth
bootstrapApplication(
  AppComponent,
  appConfig
  //   {
  //   providers: [
  //     // Initialize Firebase
  //     provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
  //     provideAnalytics(() => getAnalytics()),
  //   ],
  // }
).catch((err) => console.error(err));
