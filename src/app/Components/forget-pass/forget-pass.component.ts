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
import {
  Auth,
  FacebookAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from '@angular/fire/auth';

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.scss',
})
export class ForgetPassComponent implements OnInit {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  submitform = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50),
    ]),
  });

  emailLabel: string = 'Enter Your Email...';

  @ViewChild('Submit') Submit!: ElementRef<HTMLButtonElement>;
  @ViewChild('email') email!: ElementRef;

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
      });
    }
  }

  handleBlur(field: string) {
    const control = this.submitform.get(field);
    this.showError[field] = !!control?.invalid; // Set error state
    // Trigger shake effect and reset after 0.5s
    if (this.showError[field]) {
      setTimeout(() => (this.showError[field] = false), 500);
    }
  }

  onSubmit() {
    if (
      this.Submit?.nativeElement &&
      this.Submit?.nativeElement === document.activeElement
    ) {
      if (this.submitform.valid) {
        console.log('Form Submitted:', this.submitform.value);
        this.errsubmitmessage = '';
        this.isSubnitClick = true;
        this._AuthService
          .forgetPassword({
            email: this.submitform.get('email')?.value ?? ('' as string),
          })
          .subscribe({
            next: (res) => {
              if (res.statusMsg == 'success') {
                localStorage.setItem(
                  'emailForgetPass',
                  this.submitform.get('email')?.value ?? ('' as string)
                );
                this.errsubmitmessage = '';
                this.isSubnitClick = false;
                this.cdRef.detectChanges();
                this._Router.navigate(['/Start/verifyCode']);
              }
            },
            error: (err: HttpErrorResponse) => {
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
        // this.submitform?.get('password')?.setValue("");
        this.errsubmitmessage = '';
        this.isSubnitClick = false;
        this.cdRef.detectChanges();
        this.submitform.markAllAsTouched();
      }
    }
  }

  setFocus(inputName: string, focused: boolean) {
    this.isFocused[inputName] = focused;
    this.cdRef.markForCheck();
  }

  changeLabel(field: 'emailLabel', newText: string) {
    this[field] = newText;
  }

  resetLabel(
    field: 'emailLabel',
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
      const user = result.user;
      console.log('User signed in:', user);
      await this.router.navigate(['/Start/Home']);
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
      const user = result.user;
      console.log('user signed in:', user);
      await this.router.navigate(['/Start/Home']);
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
      const user = result.user;
      console.log('Yahoo user:', user);
      await this.router.navigate(['/Start/Home']);
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
