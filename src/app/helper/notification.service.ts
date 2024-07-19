import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private notification: NzNotificationService) {}

  errorNotification(error: HttpErrorResponse): void {
    this.notification.create(
      'error',
      `${error.status} ${error.statusText}`,
      error.error?.message || 'An unexpected error occurred'
    );
  }

  successNotification(content: string, title: string = 'Success'): void {
    this.notification.create('success', title, content);
  }

  updateNotification(content: string, title: string = 'Success'): void {
    this.notification.create('success', title, content);
  }

  customErrorNotification(content: string, title: string = 'Error'): void {
    this.notification.create('error', title, content);
  }

  customContentErrorNotification(content: string): void {
    this.notification.create('error', 'Error', content);
  }
}
