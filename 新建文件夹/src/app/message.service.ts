import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: any[] = [];

  clearTimer = null;

  constructor() { }

  add(message: string, type?: number | 1) {
    this.messages.push({
      content: message,
      type: type
    });

    // 定时清除消息
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }
    this.clearTimer = setTimeout(() => {
      this.clear();
    }, 1500);
  }

  clear() {
    this.messages = [];
  }
}
