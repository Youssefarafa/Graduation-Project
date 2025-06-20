import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss',
})
export class VerifyCodeComponent implements OnInit, OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

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

  errsubmitmessage = '';
  isSubnitClick = false;
  digits: string[] = Array(6).fill('');
  @ViewChildren('inputRef') inputRefs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild('submitButton') submitButton!: ElementRef<HTMLButtonElement>;

  onSubmit(): void {
    if (
      this.submitButton?.nativeElement &&
      this.submitButton?.nativeElement === document.activeElement
    ) {
      const otp = this.digits.join('');
      console.log('OTP submitted:', otp);
      console.log(
        'email',
        localStorage.getItem('emailForgetPass') ?? ('' as string)
      );

      this.errsubmitmessage = '';
      this.isSubnitClick = true;
      this._AuthService
        .verifyResetCode({
          email: localStorage.getItem('emailForgetPass') ?? ('' as string),
          code: otp,
        })
        .subscribe({
          next: (res) => {
            localStorage.setItem('codePass', otp);
            // if (res.status == 'success') {
            this.errsubmitmessage = '';
            this.isSubnitClick = false;
            this._Router.navigate(['/Start/resetPass']);
            this.cdRef.detectChanges();
            // }
          },
          error: (err: HttpErrorResponse) => {
            this.errsubmitmessage = err.error.message;
            this.isSubnitClick = false;
            console.log(err);

            this.cdRef.detectChanges();
          },
          complete: () => {
            console.log('complete the signup request');
            this.errsubmitmessage = '';
            this.isSubnitClick = false;
            this.cdRef.detectChanges();
          },
        });
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData
      ?.getData('text/plain')
      .replace(/\D/g, '') // Remove non-digits
      .slice(0, 6); // Get first 6 digits

    if (!pasteData) return;

    // Update all digits starting from first position
    const newDigits = [...this.digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasteData[i] || '';
    }

    this.digits = newDigits;
    this.cdRef.detectChanges();

    // Move focus to next empty input or submit
    const firstEmptyIndex = this.digits.findIndex((d) => d === '');
    if (firstEmptyIndex === -1) {
      this.submitButton.nativeElement.focus();
    } else {
      this.inputRefs.get(firstEmptyIndex)?.nativeElement.focus();
    }
  }

  trackByFn(index: number): number {
    return index;
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
    ];

    // Allow Ctrl+V (paste) by checking for Ctrl key and 'v'
    if (event.ctrlKey && event.key === 'v') {
      return; // Let the paste event handle it
    }

    // Block non-numeric keys except allowed keys
    if (!/\d/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
      return;
    }

    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      // If input is empty or cursor is at the start, move focus to previous input
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        this.handleBackspace(index);
        event.preventDefault();
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      // Move focus to previous input
      requestAnimationFrame(() => {
        this.inputRefs.get(index - 1)?.nativeElement.focus();
      });
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && index < this.digits.length - 1) {
      // Move focus to next input
      requestAnimationFrame(() => {
        this.inputRefs.get(index + 1)?.nativeElement.focus();
      });
      event.preventDefault();
    }
  } 

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Handle numeric input only
    if (/\D/.test(value)) {
      this.digits[index] = '';
      return;
    }
    if (value) {
      if (index < this.digits.length - 1) {
        requestAnimationFrame(() => {
          this.inputRefs.get(index + 1)?.nativeElement.focus();
        });
      } else if (this.isOtpValid) {
        requestAnimationFrame(() => {
          this.submitButton.nativeElement.focus();
        });
      }
    } else {
      // Move focus backward when input is cleared
      if (index > 0) {
        requestAnimationFrame(() => {
          this.inputRefs.get(index - 1)?.nativeElement.focus();
        });
      }
    }
  }

  onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  private handleBackspace(index: number): void {
    if (index > 0) {
      requestAnimationFrame(() => {
        this.inputRefs.get(index - 1)?.nativeElement.focus();
      });
    }
  }

  get isOtpValid(): boolean {
    return this.digits.every((d) => d !== '');
  }

  countdown: number = 0; // in seconds
  private timerSubscription!: Subscription;

  get formattedCountdown(): string {
    const minutes = Math.floor(this.countdown / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.countdown % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  get canResend(): boolean {
    return this.countdown === 0;
  }

  startCountdown(): void {
    this.countdown = 300; // 5 minutes in seconds
    this.timerSubscription?.unsubscribe();

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
      }
    });
  }

  resendCode(): void {
    if (!this.canResend) return;
    console.log('Resending verification code...');
    this.digits = Array(6).fill('');
    requestAnimationFrame(() => {
      this.inputRefs.first?.nativeElement.focus();
    });
    this.startCountdown();
    this._AuthService
      .forgetPassword({
        email: localStorage.getItem('emailForgetPass') ?? ('' as string),
      })
      .subscribe({
        next: (res) => {
          if (res.statusMsg == 'success') {
            this.errsubmitmessage = '';
            this.cdRef.detectChanges();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errsubmitmessage = err.error.message;
          this.cdRef.detectChanges();
        },
        complete: () => {
          console.log('complete the signup request');
          this.errsubmitmessage = '';
          this.cdRef.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
