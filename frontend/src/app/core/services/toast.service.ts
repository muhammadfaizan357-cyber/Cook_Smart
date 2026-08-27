import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  show(text: string, icon?: string): void {
    const id = ++this.counter;
    this.toasts.update((list) => [...list, { id, text, icon }]);
    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
