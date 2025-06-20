import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notified?: boolean;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class AlertComponent implements OnInit, OnDestroy {
  reminders = signal<Reminder[]>([]);
  showForm = signal(false);
  reminderForm: FormGroup;
  editingId: string | null = null;
  private notificationInterval: any;
  private scheduledTimeouts: Map<string, any> = new Map();
  private reminderCheckInterval: any;

  priorityClasses = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  constructor(private fb: FormBuilder) {
    this.reminderForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      date: ['', [Validators.required, this.futureDateValidator]],
      time: ['', Validators.required],
      priority: ['medium', Validators.required]
    });
  }

  // Custom validator for future dates
  futureDateValidator(control: any) {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return { futureDate: true };
    }
    return null;
  }

  ngOnInit() {
    this.loadReminders();
    this.setupAutoDeletion();
    this.requestNotificationPermission();
  }

  ngOnDestroy() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
    if (this.reminderCheckInterval) {
      clearInterval(this.reminderCheckInterval);
    }
    // Clear all scheduled timeouts
    this.scheduledTimeouts.forEach(timeout => clearTimeout(timeout));
    this.scheduledTimeouts.clear();
  }

  loadReminders() {
    const saved = localStorage.getItem('reminders');
    if (saved) {
      const loadedReminders = JSON.parse(saved);
      this.reminders.set(loadedReminders);
      // Setup auto-deletion for existing reminders
      this.scheduleExistingReminders();
    }
  }

  saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(this.reminders()));
  }

  setupAutoDeletion() {
    // Check every minute for reminders that should be auto-deleted
    this.reminderCheckInterval = setInterval(() => {
      this.checkAndDeleteExpiredReminders();
    }, 60000); // Check every minute
  }

  scheduleExistingReminders() {
    this.reminders().forEach(reminder => {
      if (!reminder.completed) {
        this.scheduleReminderDeletion(reminder);
      }
    });
  }

  scheduleReminderDeletion(reminder: Reminder) {
    const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
    const now = new Date();
    const timeDiff = reminderDateTime.getTime() - now.getTime();

    // If the reminder time has already passed, delete it immediately
    if (timeDiff <= 0) {
      this.autoDeleteReminder(reminder.id);
      return;
    }

    // Schedule deletion for when the reminder time arrives
    const timeoutId = setTimeout(() => {
      this.autoDeleteReminder(reminder.id);
      this.scheduledTimeouts.delete(reminder.id);
    }, timeDiff);

    this.scheduledTimeouts.set(reminder.id, timeoutId);
  }

  checkAndDeleteExpiredReminders() {
    const now = new Date();
    const currentReminders = this.reminders();
    
    currentReminders.forEach(reminder => {
      if (!reminder.completed) {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
        if (reminderDateTime.getTime() <= now.getTime()) {
          this.autoDeleteReminder(reminder.id);
        }
      }
    });
  }

  autoDeleteReminder(id: string) {
    // Show notification before deleting
    const reminder = this.reminders().find(r => r.id === id);
    if (reminder && !reminder.completed) {
      this.showNotification(reminder);
    }

    // Delete the reminder
    this.reminders.update(items => items.filter(item => item.id !== id));
    this.saveReminders();
    
    // Clear any scheduled timeout for this reminder
    if (this.scheduledTimeouts.has(id)) {
      clearTimeout(this.scheduledTimeouts.get(id));
      this.scheduledTimeouts.delete(id);
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }

  showNotification(reminder: Reminder) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      const notification = new Notification('⏰ Reminder Time!', {
        body: `${reminder.title} - This reminder will be automatically deleted.`,
        icon: '/favicon.ico',
        requireInteraction: true
      });

      // Auto-close notification after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  }

  openForm(reminder?: Reminder) {
    if (reminder) {
      this.editingId = reminder.id;
      this.reminderForm.patchValue({
        title: reminder.title,
        description: reminder.description,
        date: reminder.date,
        time: reminder.time,
        priority: reminder.priority
      });
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.reminderForm.reset({ priority: 'medium', description: '', title: '' });
    this.editingId = null;
  }

  submitForm() {
    if (this.reminderForm.invalid) return;

    const formValue = this.reminderForm.value;
    const newReminder: Reminder = {
      id: this.editingId || Date.now().toString(),
      title: formValue.title,
      description: formValue.description,
      date: formValue.date,
      time: formValue.time,
      priority: formValue.priority,
      completed: false,
      notified: false
    };

    if (this.editingId) {
      // Cancel existing scheduled deletion for edited reminder
      if (this.scheduledTimeouts.has(this.editingId)) {
        clearTimeout(this.scheduledTimeouts.get(this.editingId));
        this.scheduledTimeouts.delete(this.editingId);
      }

      this.reminders.update(items => 
        items.map(item => item.id === this.editingId ? newReminder : item)
      );
    } else {
      // Add new reminder to the beginning of the array
      this.reminders.update(items => [newReminder, ...items]);
    }

    // Schedule auto-deletion for the new/updated reminder
    this.scheduleReminderDeletion(newReminder);

    // Save and close form
    this.saveReminders();
    this.closeForm();
    
    // Force change detection by logging the current state
    console.log('Current reminders count:', this.reminders().length);
  }

  completeReminder(id: string) {
    this.reminders.update(items => 
      items.map(item => 
        item.id === id ? { ...item, completed: true } : item
      )
    );
    
    // Cancel scheduled auto-deletion since reminder is completed
    if (this.scheduledTimeouts.has(id)) {
      clearTimeout(this.scheduledTimeouts.get(id));
      this.scheduledTimeouts.delete(id);
    }

    // Delete completed reminder after 3 seconds
    setTimeout(() => {
      this.deleteReminder(id);
    }, 3000);
  }

  deleteReminder(id: string) {
    this.reminders.update(items => items.filter(item => item.id !== id));
    this.saveReminders();
    
    // Cancel any scheduled timeout for this reminder
    if (this.scheduledTimeouts.has(id)) {
      clearTimeout(this.scheduledTimeouts.get(id));
      this.scheduledTimeouts.delete(id);
    }
    
    // Log current state for debugging
    console.log('After deletion - reminders count:', this.reminders().length);
  }

  // Helper method to get reminder count (for debugging)
  get reminderCount(): number {
    return this.reminders().length;
  }

  trackByReminderId(index: number, reminder: Reminder): string {
  return reminder.id;
}
}