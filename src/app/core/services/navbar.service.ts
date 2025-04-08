import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  constructor() {}
  private isDarkModeSubject = new BehaviorSubject<boolean>(false); // Default to light mode
  isDarkMode$ = this.isDarkModeSubject.asObservable();
  // Setter to manually update the dark mode state
  setDarkMode(isDark: boolean) {
    this.isDarkModeSubject.next(isDark); // Update the BehaviorSubject value
  }
}
