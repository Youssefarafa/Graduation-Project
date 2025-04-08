import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  EventEmitter,
  NgZone,
} from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  // FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  OAuthProvider,
} from '@angular/fire/auth';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NavbarService } from '../../core/services/navbar.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgClass,
    RouterLink,
    NgxCaptchaModule,
  ], //FormsModule
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  isDarkMode = false;
  _DarkMode = inject(NavbarService);
  register = new FormGroup(
    {
      recaptcha: new FormControl(null, [Validators.required]),
      fname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
      ]),
      lname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,15}$/
        ),
      ]),
      rePassword: new FormControl(null, [
        Validators.required,
        this.confirmpassword('password'),
      ]),
    }
    //! this.confirmpassword_0
  );

  fnameLabel: string = 'Enter Your First Name...';
  lnameLabel: string = 'Enter Your Last Name...';
  emailLabel: string = 'Enter Your Email...';
  passwordLabel: string = 'Enter Your Password...';
  confirmPasswordLabel: string = 'Enter Your Confirm Password...';

  @ViewChild('CreateAccunt') CreateAccunt!: ElementRef<HTMLButtonElement>;
  @ViewChild('fname') fname!: ElementRef;
  @ViewChild('lname') lname!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @ViewChild('rePassword') rePassword!: ElementRef;

  showPassword = false;
  showConfirmPassword = false;
  isChecked = false;
  passwordStrength = '';
  isFocused: { [key: string]: boolean } = {}; // Object to track focus for multiple inputs
  showError: { [key: string]: boolean } = {}; // Object to track errors dynamically
  passwordControl: Subscription | undefined = undefined; //Subscription | null = null;
  confirmPasswordControl = this.register.get('rePassword');
  isSubnitClick = false;
  errsubmitmessage = '';

  constructor(
    private platformDetectionService: PlatformDetectionService,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef
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

        this.passwordControl = this.register
          .get('password')
          ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
          .subscribe((value: string | null) => {
            if (value !== null) {
              // ✅ Only call function when value is not null
              this.passwordStrength = this.checkPasswordStrength(value);
            }
            if (this.confirmPasswordControl?.value) {
              this.confirmPasswordControl?.updateValueAndValidity({
                onlySelf: true,
              });
            }
            this.cdRef.markForCheck();
          });
      });
    }
  }

  checkPasswordStrength(password: string | null): string {
    if (!password) return '';
    const conditions = {
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
      isValidLength: password.length >= 8 && password.length <= 15,
      isSpace: /\s/.test(password),
    };
    const strengthLevels = [
      {
        condition:
          conditions.hasUpper &&
          conditions.hasLower &&
          conditions.hasNumber &&
          conditions.hasSpecial &&
          conditions.isValidLength &&
          !conditions.isSpace,
        label: 'Very Strong',
      },
      {
        condition:
          conditions.hasUpper &&
          conditions.hasLower &&
          conditions.hasNumber &&
          conditions.isValidLength &&
          !conditions.isSpace,
        label: 'Strong',
      },
      {
        condition:
          conditions.hasUpper &&
          conditions.hasLower &&
          conditions.hasNumber &&
          !conditions.isSpace,
        label: 'Medium',
      },
      {
        condition:
          (conditions.hasUpper || conditions.hasLower) &&
          conditions.hasNumber &&
          !conditions.isSpace,
        label: 'Easy',
      },
      {
        condition:
          (conditions.hasUpper || conditions.hasLower) && !conditions.isSpace,
        label: 'Very Easy',
      },
      {
        condition: conditions.isSpace,
        label: 'Weak',
      },
    ];
    return strengthLevels.find((level) => level.condition)?.label || 'Weak';
  }

  togglePasswordVisibility(type: 'password' | 'rePassword') {
    this[type === 'password' ? 'showPassword' : 'showConfirmPassword'] =
      !this[type === 'password' ? 'showPassword' : 'showConfirmPassword'];
    this.cdRef.markForCheck();
  }

  onSubmit() {
    if (this.CreateAccunt?.nativeElement === document.activeElement) {
      if (!this.isChecked && this.register.valid) {
        alert('Please agree to the terms and conditions.');
        this.errsubmitmessage = '';
        this.isSubnitClick = false;
        this.cdRef.detectChanges();
        return;
      }
      if (this.register.valid) {
        console.log('Form Submitted:', this.register.value);
        this.errsubmitmessage = '';
        this.isSubnitClick = true;
        console.log(this.register.value);

        this._AuthService
          .signup(
            // this.register.value
            {
              // fname: this.register.get('fname')?.value ?? ('' as string),
              name: this.register.get('lname')?.value ?? ('' as string),
              email: this.register.get('email')?.value ?? ('' as string),
              password: this.register.get('password')?.value ?? ('' as string),
              rePassword:
                this.register.get('rePassword')?.value ?? ('' as string),
            }
          )
          .subscribe({
            next: (res) => {
              if (res.message == 'success') {
                this._Router.navigate(['/Start/Login']);
              }
              console.log('res:  ', res);
              this.errsubmitmessage = '';
              this.isSubnitClick = false;
              this.cdRef.detectChanges();
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
        // this.register?.get('password')?.setValue("");
        this.errsubmitmessage = '';
        this.isSubnitClick = false;
        this.cdRef.detectChanges();
        this.register.markAllAsTouched();
      }
    }
  }

  setFocus(inputName: string, focused: boolean) {
    this.isFocused[inputName] = focused;
    this.cdRef.markForCheck();
  }

  //! confirmpassword_0(g: AbstractControl) {return g.get('password')?.value == g.get('rePassword')?.value ? null : { mismatch: true };}
  confirmpassword(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null; // Avoid running on initialization
      }
      const password = control.parent.get(passwordField);
      return password?.value === control.value ? null : { mismatch: true };
    };
  }

  changeLabel(
    field:
      | 'fnameLabel'
      | 'lnameLabel'
      | 'emailLabel'
      | 'passwordLabel'
      | 'confirmPasswordLabel',
    newText: string
  ) {
    this[field] = newText;
  }

  resetLabel(
    field:
      | 'fnameLabel'
      | 'lnameLabel'
      | 'emailLabel'
      | 'passwordLabel'
      | 'confirmPasswordLabel',
    defaultText: string,
    inputElement: HTMLInputElement
  ) {
    if (inputElement.value == '') {
      this[field] = defaultText;
    }
  }

  toggleChicked() {
    this.isChecked = !this.isChecked;
    this.cdRef.markForCheck();
  }

  onChildClick(event: Event) {
    event.stopPropagation(); // Prevents bubbling to parent
    event.preventDefault(); // Prevents default behavior (if needed)
  }

  isPasswordInvalid(rule: string): boolean {
    const password = this.register.get('password')?.value || '';
    switch (rule) {
      case 'length':
        return !/^.{8,15}$/.test(password); // Ensure length is between 8-10 characters
      case 'uppercase':
        return !/[A-Z]/.test(password); // At least one uppercase letter
      case 'lowercase':
        return !/[a-z]/.test(password); // At least one lowercase letter
      case 'number':
        return !/\d/.test(password); // At least one digit
      case 'special':
        return !/[@$!%*?#&]/.test(password); // At least one special character
      case 'noSpaces':
        return /\s/.test(password); // Returns true if spaces exist
      default:
        return false;
    }
  }

  get passwordClass() {
    const passwordControl = this.register.get('password');
    if (!passwordControl) return '';
    if (this.showError['password'])
      return 'border-red-500 ring-2 ring-red-500 animate-shake';
    if (this.passwordStrength === '') return 'focus:ring-blue-400';
    if (this.passwordStrength === 'Very Strong') return 'focus:ring-green-500';
    if (this.passwordStrength === 'Strong') return 'focus:ring-teal-500';
    if (this.passwordStrength === 'Medium') return 'focus:ring-yellow-500';
    if (this.passwordStrength === 'Easy') return 'focus:ring-orange-500';
    if (this.passwordStrength === 'Very Easy') return 'focus:ring-gray-500';
    if (
      this.passwordStrength === 'Weak' ||
      (this.passwordStrength === '' &&
        (passwordControl.touched || passwordControl.dirty))
    ) {
      return 'focus:ring-red-500';
    }
    return '';
  }

  get passwordErrors() {
    const errors: string[] = [];
    const control = this.register.get('password');
    if (!control || !control.errors) return errors;
    if (this.isPasswordInvalid('length'))
      errors.push('Minimum 8 and maximum 15 characters.');
    if (this.isPasswordInvalid('uppercase'))
      errors.push('At least one uppercase letter.');
    if (this.isPasswordInvalid('lowercase'))
      errors.push('At least one lowercase letter.');
    if (this.isPasswordInvalid('number')) errors.push('At least one number.');
    if (this.isPasswordInvalid('special'))
      errors.push('At least one special character.');
    if (this.isPasswordInvalid('noSpaces')) errors.push('No spaces allowed.');
    return errors;
  }

  handleBlur(field: string) {
    const control = this.register.get(field);
    if (field === 'rePassword' && !this.register.get('password')?.value) {
      return; // Don't show error for rePassword if password is empty
    }
    this.showError[field] = !!control?.invalid; // Set error state
    // Trigger shake effect and reset after 0.5s
    if (this.showError[field]) {
      setTimeout(() => (this.showError[field] = false), 500);
    }
  }

  openModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden'); // Show modal
      modal.removeAttribute('aria-hidden'); // Ensure it's visible to assistive tech
      // Move focus inside the modal
      const focusableElement = modal.querySelector(
        'button, a, input, textarea, select'
      );
      if (focusableElement) {
        (focusableElement as HTMLElement).focus();
      }
    }
  }

  closeModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden'); // Hide modal
      modal.setAttribute('aria-hidden', 'true'); // Hide from assistive tech
      // Move focus back to the button that opened the modal
      const triggerButton = document.querySelector(
        `[data-modal-target="${modalId}"]`
      );
      if (triggerButton) {
        (triggerButton as HTMLElement).focus();
      }
    }
  }

  ngOnDestroy() {
    this.passwordControl?.unsubscribe();
  }

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  isSubmissionInProgress = false;
  errorMessageForGoogleAndFacebookAndYahoo = '';
  typeAuthByFirbase = '';

  async onSignUpWithGoogle() {
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
      console.log('User signed up:', user);
      await this.router.navigate(['/Start/Home']);
    } catch (error) {
      console.error('Google Sign-up Error:', error);
      this.handleSignUpError(error);
    } finally {
      this.ngZone.run(() => {
        this.isSubmissionInProgress = false;
        this.typeAuthByFirbase = '';
        this.cdRef.detectChanges();
      });
    }
  }

  async onSignUpWithFacebook() {
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
      console.log('user signed up:', user);
      await this.router.navigate(['/Start/Home']);
    } catch (error) {
      console.error('Sign-up Error:', error);
      this.handleSignUpError(error);
    } finally {
      this.ngZone.run(() => {
        this.isSubmissionInProgress = false;
        this.typeAuthByFirbase = '';
        this.cdRef.detectChanges();
      });
    }
  }

  async onSignUpWithYahoo() {
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
      console.error('Yahoo Sign-up Error:', error);
      this.handleSignUpError(error);
    } finally {
      this.ngZone.run(() => {
        this.isSubmissionInProgress = false;
        this.typeAuthByFirbase = '';
        this.cdRef.detectChanges();
      });
    }
  }

  private handleSignUpError(error: any): void {
    console.error('Google Sign-up Error:', error);
    const errorMessages: { [key: string]: string } = {
      'auth/popup-closed-by-user': 'Sign-up canceled. Please try again.',
      'auth/account-exists-with-different-credential':
        'This email is already registered with another sign-up method.',
      'auth/network-request-failed':
        'Network error. Please check your internet connection.',
    };
    this.errorMessageForGoogleAndFacebookAndYahoo =
      errorMessages[error.code] || 'Sign-up failed. Please try again.';
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.errorMessageForGoogleAndFacebookAndYahoo = '';
      this.cdRef.detectChanges();
    }, 5000);
  }
}
