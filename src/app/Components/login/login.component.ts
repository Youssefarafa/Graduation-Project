import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import {
  FormControl,
  FormGroup,
  // FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import { NavbarService } from '../../core/services/navbar.service';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink,NgxCaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  private readonly cookieService = inject(CookieService);
    isDarkMode = false;
    _DarkMode = inject(NavbarService);
  login = new FormGroup({
    recaptcha: new FormControl(null, [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [Validators.required]),
  });

  emailLabel: string = 'Enter Your Email...';
  passwordLabel: string = 'Enter Your Password...';

  @ViewChild('LoggingIn') LoggingIn!: ElementRef<HTMLButtonElement>;
  @ViewChild('rememberMe') checkbox!: ElementRef<HTMLInputElement>;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('password') password!: ElementRef;

  showPassword = false;
  isChecked = false;
  isFocused: { [key: string]: boolean } = {}; // Object to track focus for multiple inputs
  showError: { [key: string]: boolean } = {}; // Object to track errors dynamically
  isSubnitClick = false;
  errsubmitmessage = '';

  constructor(
    private platformDetectionService: PlatformDetectionService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
      });
      // Access the DOM safely after rendering
      this.platformDetectionService.executeAfterDOMRender(() => {
        //Start code there...
        this._DarkMode.isDarkMode$.subscribe((darkMode) => {
          this.isDarkMode = darkMode; // Update local component state
          this.cdRef.markForCheck();
        });

        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail && savedPassword) {
          this.login?.setValue({
            recaptcha: null,
            email: savedEmail,
            password: savedPassword,
          });
          this.isChecked = true;
          this.checkbox.nativeElement.checked = true;
          this.email.nativeElement.focus();
          this.password.nativeElement.focus();
          this.password.nativeElement.blur();
          //! Automatically submit the form if credentials exist
          //! this.onSubmit();
        }
      });
    }
  }

  togglePasswordVisibility() {
    this['showPassword'] = !this['showPassword'];
    this.cdRef.markForCheck();
  }

  toggleChicked() {
    this.isChecked = !this.isChecked;
    this.cdRef.markForCheck();
  }

  handleBlur(field: string) {
    const control = this.login.get(field);
    this.showError[field] = !!control?.invalid; // Set error state
    // Trigger shake effect and reset after 0.5s
    if (this.showError[field]) {
      setTimeout(() => (this.showError[field] = false), 500);
    }
  }

  onSubmit() {
    // if (this.login.value.email && this.login.value.password) {
    //   signInWithEmailAndPassword(
    //     this.auth,
    //     this.login.value.email!,
    //     this.login.value.password!
    //   )
    //     .then((userCredential) => {
    //       // Login successful
    //       this._Router.navigate(['/Start/Home']);
    //     })
    //     .catch((error) => {
    //       // Handle errors
    //       console.log('error:', error);
    //       this.isSubmitionInProgress = false;
    //     });
    // }

    if (
      this.LoggingIn?.nativeElement &&
      this.LoggingIn?.nativeElement === document.activeElement
    ) {
      if (this.checkbox.nativeElement.checked) {
        localStorage.setItem('email', this.login.value.email || '');
        localStorage.setItem('password', this.login.value.password || '');
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
      if (this.login.valid) {
        console.log('Form Submitted:', this.login.value);
        this.errsubmitmessage = '';
        this.isSubnitClick = true;
        this._AuthService
          .signin({
            email: this.login.get('email')?.value ?? ('' as string),
            password: this.login.get('password')?.value ?? ('' as string),
          })
          .subscribe({
            next: (res) => {
              if (res.message == 'success') {
                localStorage.setItem('token', res.token);
                this.cookieService.set('auth_token', res.token);
                this._AuthService.saveUserData();
                console.log('res:  ', res);
                this.errsubmitmessage = '';
                this.isSubnitClick = false;
                this.cdRef.detectChanges();
                this._Router.navigate(['/User/Shop']);
              }
            },
            error: (err: HttpErrorResponse) => {
              console.log('err:  ', err);
              console.log('err:  ', err.error.message);
              this.errsubmitmessage = err.error.message;
              this.isSubnitClick = false;
              this.cdRef.detectChanges();
            },
            complete: () => {
              console.log('complete the signup request');
              this.errsubmitmessage = '';
              this.isSubnitClick = false;
              this.cdRef.detectChanges();
            },
          });
      } else {
        // this.login?.get('password')?.setValue("");
        this.errsubmitmessage = '';
        this.isSubnitClick = false;
        this.cdRef.detectChanges();
        this.login.markAllAsTouched();
      }
    }
  }

  setFocus(inputName: string, focused: boolean) {
    this.isFocused[inputName] = focused;
    this.cdRef.markForCheck();
  }

  changeLabel(field: 'emailLabel' | 'passwordLabel', newText: string) {
    this[field] = newText;
  }

  resetLabel(
    field: 'emailLabel' | 'passwordLabel',
    defaultText: string,
    inputElement: HTMLInputElement
  ) {
    if (inputElement.value == '') {
      this[field] = defaultText;
    }
  }

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  isSubmissionInProgress = false;
  errorMessageForGoogleAndFacebookAndYahoo = '';
  typeAuthByFirbase = '';

  async onSignInWithGoogle() {
    try {
      this.ngZone.run(() => {
        this.isSubmissionInProgress = true;
        this.typeAuthByFirbase = 'Google';
        this.cdRef.detectChanges();
      });
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      await this.auth.signOut();
      const result = await signInWithPopup(this.auth, provider);
      //?  result and this.typeAuthByFirbase will send
      const user = result.user;
      console.log('User signed in:', user);
      await this.router.navigate(['/User/Shop']);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      this.handleSignInError(error);
    } finally {
      this.ngZone.run(() => {
        this.isSubmissionInProgress = false;
        this.typeAuthByFirbase = '';
        this.cdRef.detectChanges();
      });
    }
  }

    async onSignInWithFacebook() {
      try {
        this.ngZone.run(() => {
          this.isSubmissionInProgress = true;
          this.typeAuthByFirbase = 'Facebook';
          this.cdRef.detectChanges();
        });
        const provider = new FacebookAuthProvider();
        provider.addScope('email'); // Optional, but useful
        provider.addScope('public_profile');
        await this.auth.signOut();
        const result = await signInWithPopup(this.auth, provider);
        //?  result and this.typeAuthByFirbase will send
        const user = result.user;
        console.log('user signed in:', user);
        await this.router.navigate(['/User/Shop']);
      } catch (error) {
        console.error('Sign-in Error:', error);
        this.handleSignInError(error);
      } finally {
        this.ngZone.run(() => {
          this.isSubmissionInProgress = false;
          this.typeAuthByFirbase = '';
          this.cdRef.detectChanges();
        });
      }
    }
  
    async onSignInWithYahoo() {
      try {
        this.ngZone.run(() => {
          this.isSubmissionInProgress = true;
          this.typeAuthByFirbase = 'Yahoo';
          this.cdRef.detectChanges();
        });
        const provider = new OAuthProvider('yahoo.com');
        provider.addScope('email');
        provider.addScope('profile');
        await this.auth.signOut();
        const result = await signInWithPopup(this.auth, provider);
        //?  result and this.typeAuthByFirbase will send
        const user = result.user;
        console.log('Yahoo user:', user);
        await this.router.navigate(['/User/Shop']);
      } catch (error) {
        console.error('Yahoo Sign-in Error:', error);
        this.handleSignInError(error);
      } finally {
        this.ngZone.run(() => {
          this.isSubmissionInProgress = false;
          this.typeAuthByFirbase = '';
          this.cdRef.detectChanges();
        });
      }
    }
  
  handleSignInError(error: any): void {
    console.error('Google Sign-In Error:', error);
    const errorMessages: { [key: string]: string } = {
      'auth/popup-closed-by-user': 'Sign-in canceled. Please try again.',
      'auth/account-exists-with-different-credential':
        'This email is already registered with another sign-in method.',
      'auth/network-request-failed':
        'Network error. Please check your internet connection.',
    };
    this.errorMessageForGoogleAndFacebookAndYahoo =
      errorMessages[error.code] || 'Sign-in failed. Please try again.';
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.errorMessageForGoogleAndFacebookAndYahoo = '';
      this.cdRef.detectChanges();
    }, 5000);
  }
}
