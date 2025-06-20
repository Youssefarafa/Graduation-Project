import { Component, ElementRef, ViewChild, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import emailjs from 'emailjs-com';
import { NavbarService } from '../../core/services/navbar.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  // Constants
  private readonly EMAIL_SERVICE_ID = 'service_eydytlg';
  private readonly EMAIL_TEMPLATE_ID = 'template_x7aaguc';
  private readonly EMAIL_USER_ID = 'I0N_KQNgE1e86lQbQ';
  private readonly API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1/auth';

  // View children+
  @ViewChild('profileImageInput') profileImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('avatarImage') avatarImage!: ElementRef<HTMLImageElement>;
  @ViewChild('avatarFallback') avatarFallback!: ElementRef<HTMLDivElement>;
  @ViewChild('toast') toast!: ElementRef<HTMLDivElement>;

  // Forms
  profileForm: FormGroup;
  contactForm: FormGroup;
  forgotPasswordForm: FormGroup;
  verificationForm: FormGroup;
  resetPasswordForm: FormGroup;

  // State
  profileData: any = {
    name: JSON.parse(localStorage.getItem('register')?? '').fName+' '+ JSON.parse(localStorage.getItem('register')?? '').lName,
    phone: JSON.parse(localStorage.getItem('register')?? '').phoneNumber,
    address: ''
  };
  profileImage: string | null = null;
  currentPage: 'profile' | 'forgotPassword' | 'resetPassword' = 'profile';
  isSubmitting = false;
  isEditing = false;
  resetToken: string | null = null;
  
  // Toast
  showToast = false;
  toastTitle = '';
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  // Forgot password
  showForgotPasswordForm = true;
  showVerificationForm = false;
  forgotPasswordDescription = 'Enter your email to receive a verification code';
  resetPasswordDescription = '';
  emailError = '';
  verificationError = '';
  passwordError = '';
  confirmPasswordError = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private renderer: Renderer2,
    private _NavbarService:NavbarService,
    private _AuthService:AuthService
  ) {
    // Initialize forms with enhanced validation
    this.profileForm = this.fb.group({
      name: [this.profileData.name, [
        Validators.required,
        Validators.minLength(2),
        // Validators.pattern(/^[a-zA-Z\s]*$/) // Only letters and spaces
      ]],
      phone: [this.profileData.phone, [
        Validators.pattern(/^\+?[\d\s-]{10,}$/) // Basic phone number validation
      ]],
      address: [this.profileData.address, [
        Validators.maxLength(200)
      ]]
    });

    this.contactForm = this.fb.group({
      contactName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]],
      contactEmail: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      contactSubject: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      contactMessage: ['', [
        Validators.required,
        Validators.maxLength(1000)
      ]]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]]
    });

    this.verificationForm = this.fb.group({
      verificationCode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^\d{6}$/) // 6-digit code
      ]]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/) // At least one lowercase, uppercase, and number
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this._NavbarService.FunCallFromAccount();
    this.initEmailJS();
    this.loadProfile();
    this.currentPage = 'profile';
    // console.log(JSON.parse(localStorage.getItem('register')?? '').fName);
  }

  ngOnDestroy() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  private initEmailJS() {
    emailjs.init(this.EMAIL_USER_ID);
  }

  private loadProfile() {
    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
      try {
        this.profileData = JSON.parse(savedProfileData);
        this.profileForm.patchValue(this.profileData);
      } catch (e) {
        console.error('Failed to parse saved profile data', e);
      }
    }

    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      this.profileImage = savedProfileImage;
      this._NavbarService.FunCallFromAccount();
    }
  }

  private updateProfileDisplay() {
    this.profileData = this.profileForm.value;
    localStorage.setItem('profileData', JSON.stringify(this.profileData));
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getInitials(name: string | null | undefined): string {
    if (!name) return 'JD';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.profileData);
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.updateProfileDisplay();
    this.isEditing = false;
    this.showToastNotification('Profile updated', 'Your profile information has been saved.');
  }

  handleProfileImageClick() {
    this.profileImageInput.nativeElement.click();
  }

  handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      this.showToastNotification('Invalid file type', 'Please select an image file.', 'error');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this.profileImage = e.target.result.toString();
        localStorage.setItem('profileImage', this.profileImage!);
        this._NavbarService.FunCallFromAccount();
        this._AuthService.addPhoto(formData ).subscribe({
          next: (res) => {
            this.showToastNotification('Successfully', 'The Photo Change Correctly.', 'success');
          },
          error: (err) => {
            console.log(err);
          },
        })
      }
    };
    
    reader.onerror = () => {
      this.showToastNotification('Error', 'Failed to read the image file.', 'error');
    };
    
    reader.readAsDataURL(file);
  }

  async sendEmail() {
    if (this.contactForm.invalid || this.isSubmitting) {
      this.contactForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      await emailjs.send(
        this.EMAIL_SERVICE_ID,
        this.EMAIL_TEMPLATE_ID,
        {
          from_name: this.contactForm.value.contactName,
          from_email: this.contactForm.value.contactEmail,
          reply_to: this.contactForm.value.contactEmail,
          subject: this.contactForm.value.contactSubject,
          message: this.contactForm.value.contactMessage,
          email: this.contactForm.value.contactEmail
        }
      );
      
      this.showToastNotification('Message sent', 'Your message has been sent successfully!');
      this.contactForm.reset();
    } catch (err) {
      console.error('Failed to send email', err);
      this.showToastNotification('Error', 'Failed to send your message. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  showForgotPasswordPage() {
    this.currentPage = 'forgotPassword';
    this.showForgotPasswordForm = true;
    this.showVerificationForm = false;
    this.forgotPasswordDescription = 'Enter your email to receive a verification code';
    this.emailError = '';
    this.forgotPasswordForm.reset();
    this.verificationForm.reset();
  }

  showResetPasswordPage() {
    this.currentPage = 'resetPassword';
    const resetEmail = localStorage.getItem('resetEmail');
    this.resetPasswordDescription = resetEmail 
      ? `Create a new password for ${resetEmail}`
      : 'Create a new password';
  }

  async handleSendVerification() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      this.emailError = 'Please enter a valid email address';
      return;
    }
    
    const email = this.forgotPasswordForm.value.email;
    this.emailError = '';
    this.isSubmitting = true;
    
    try {
      const response = await this.http.post(
        `${this.API_BASE_URL}/forgotPasswords`,
        { email }
      ).toPromise();
      
      localStorage.setItem('resetEmail', email);
      this.showForgotPasswordForm = false;
      this.showVerificationForm = true;
      this.forgotPasswordDescription = `Enter the verification code sent to ${email}`;
      this.showToastNotification('Code sent', `A verification code has been sent to ${email}.`);
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      this.emailError = error.error?.message || 'Failed to send verification code. Please try again.';
      this.showToastNotification('Error', this.emailError, 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  async handleVerifyCode() {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      this.verificationError = 'Please enter a valid 6-digit code';
      return;
    }
    
    const code = this.verificationForm.value.verificationCode;
    const storedEmail = localStorage.getItem('resetEmail');
    
    if (!storedEmail) {
      this.verificationError = 'Session expired. Please try again.';
      this.showToastNotification('Error', this.verificationError, 'error');
      return;
    }
    
    try {
      const response: any = await this.http.post(
        `${this.API_BASE_URL}/verifyResetCode`,
        { resetCode: code }
      ).toPromise();
      
      if (response.token) {
        this.resetToken = response.token;
        localStorage.setItem('resetToken', response.token);
      }
      
      this.showResetPasswordPage();
      this.showToastNotification('Success', 'Code verified successfully');
    } catch (error: any) {
      console.error('Error verifying code:', error);
      this.verificationError = error.error?.message || 'Invalid verification code. Please try again.';
      this.showToastNotification('Error', this.verificationError, 'error');
    }
  }

  async handleResetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      if (this.resetPasswordForm.errors?.['mismatch']) {
        this.confirmPasswordError = "Passwords don't match";
      }
      if (this.resetPasswordForm.get('newPassword')?.errors) {
        this.passwordError = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
      }
      return;
    }
    
    const password = this.resetPasswordForm.value.newPassword;
    const email = localStorage.getItem('resetEmail');
    const resetToken = localStorage.getItem('resetToken') || this.resetToken;
    
    this.passwordError = '';
    this.confirmPasswordError = '';
    
    if (!email) {
      this.passwordError = 'Session expired. Please try again from the beginning.';
      this.showToastNotification('Error', this.passwordError, 'error');
      return;
    }
    
    try {
      await this.http.put(
        `${this.API_BASE_URL}/resetPassword`,
        { email, newPassword: password }
      ).toPromise();
      
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetToken');
      this.resetToken = null;
      
      this.showToastNotification('Success', 'Your password has been reset successfully.');
      this.goToProfilePage();
    } catch (error: any) {
      console.error('Error resetting password:', error);
      this.passwordError = error.error?.message || 'Failed to reset password. Please try again.';
      this.showToastNotification('Error', this.passwordError, 'error');
    }
  }

  goToProfilePage() {
    this.currentPage = 'profile';
  }

  goBackFromForgotPassword() {
    if (this.showVerificationForm) {
      this.showVerificationForm = false;
      this.showForgotPasswordForm = true;
      this.forgotPasswordDescription = 'Enter your email to receive a verification code';
    } else {
      this.goToProfilePage();
    }
  }

  showToastNotification(title: string, message: string, type: 'success' | 'error' = 'success') {
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 5000);
  }

  hideToast() {
    this.showToast = false;
  }
}