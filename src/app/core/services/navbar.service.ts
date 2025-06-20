import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  constructor() {} 
  
  photoProfile: BehaviorSubject<any> = new BehaviorSubject(JSON.parse(localStorage.getItem('register')?? '').userPictureUrl);
  changePhotoProfile(): any {
    return localStorage.getItem('profileImage');
  }
  FunCallFromAccount(){
    this.photoProfile.next(this.changePhotoProfile());
  }
  FunCallFromNavBarUser(){
    this.photoProfile.next('');
  }
  private isDarkModeSubject = new BehaviorSubject<boolean>(false); // Default to light mode
  isDarkMode$ = this.isDarkModeSubject.asObservable();
  // Setter to manually update the dark mode state
  setDarkMode(isDark: boolean) {
    this.isDarkModeSubject.next(isDark); // Update the BehaviorSubject value
  }
  isHome: boolean = false;
  isOurteam: boolean = false;
}
