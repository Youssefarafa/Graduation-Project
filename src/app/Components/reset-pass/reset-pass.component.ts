import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  debounceTime,
  distinctUntilChanged,
  Subscription,
} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-reset-pass',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.scss',
})
export class ResetPassComponent implements OnInit, OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  private readonly cookieService = inject(CookieService);

  constructor(
    private platformDetectionService: PlatformDetectionService,
    private cdRef: ChangeDetectorRef,
  ) {}

  setNewPass = new FormGroup(
    {
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

  passwordLabel: string = 'Enter Your Password...';
  confirmPasswordLabel: string = 'Enter Your Confirm Password...';
  @ViewChild('password') password!: ElementRef;
  @ViewChild('rePassword') rePassword!: ElementRef;
  @ViewChild('submitButton') submitButton!: ElementRef<HTMLButtonElement>;
  showPassword = false;
  showConfirmPassword = false;
  isChecked = false;
  passwordStrength = '';
  errsubmitmessage = '';
  isSubnitClick = false;
  isFocused: { [key: string]: boolean } = {}; // Object to track focus for multiple inputs
  showError: { [key: string]: boolean } = {}; // Object to track errors dynamically
  passwordControl: Subscription | undefined = undefined; //Subscription | null = null;
  confirmPasswordControl = this.setNewPass.get('rePassword');

  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
      });
      // Access the DOM safely after rendering
      this.platformDetectionService.executeAfterDOMRender(() => {
        //Start code there...
        this.passwordControl = this.setNewPass
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

  onSubmit(): void {
    if (
      this.submitButton?.nativeElement &&
      this.submitButton?.nativeElement === document.activeElement
    ) {
      if (this.setNewPass.valid) {
        console.log('Form Submitted:', this.setNewPass.value);
        this.errsubmitmessage = '';
        this.isSubnitClick = true;
        console.log(this.setNewPass.value);
        this._AuthService
          .resetPassword({
            email: localStorage.getItem('emailForgetPass') ?? ('' as string),
            newPassword:
              this.setNewPass.get('password')?.value ?? ('' as string),
            code: localStorage.getItem('codePass') ?? ('' as string),
          })
          .subscribe({
            next: (res) => {
              localStorage.setItem('token', res.token);
              this.cookieService.set('auth_token', res.token);
              this._AuthService.saveUserData();
              console.log('res:  ', res);
              this.errsubmitmessage = '';
              this.isSubnitClick = false;
              this.cdRef.detectChanges();
              this._Router.navigate(['/Start/Home']);
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
              localStorage.removeItem('emailForgetPass');
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
        this.setNewPass.markAllAsTouched();
      }
    }
  }

  setFocus(inputName: string, focused: boolean) {
    this.isFocused[inputName] = focused;
    this.cdRef.markForCheck();
  }

  changeLabel(
    field: 'passwordLabel' | 'confirmPasswordLabel',
    newText: string
  ) {
    this[field] = newText;
  }

  resetLabel(
    field: 'passwordLabel' | 'confirmPasswordLabel',
    defaultText: string,
    inputElement: HTMLInputElement
  ) {
    if (inputElement.value == '') {
      this[field] = defaultText;
    }
  }

  isPasswordInvalid(rule: string): boolean {
    const password = this.setNewPass.get('password')?.value || '';
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
    const passwordControl = this.setNewPass.get('password');
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
    const control = this.setNewPass.get('password');
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
    const control = this.setNewPass.get(field);
    if (field === 'rePassword' && !this.setNewPass.get('password')?.value) {
      return; // Don't show error for rePassword if password is empty
    }
    this.showError[field] = !!control?.invalid; // Set error state
    // Trigger shake effect and reset after 0.5s
    if (this.showError[field]) {
      setTimeout(() => (this.showError[field] = false), 500);
    }
  }

  ngOnDestroy() {
    this.passwordControl?.unsubscribe();
  }
}
