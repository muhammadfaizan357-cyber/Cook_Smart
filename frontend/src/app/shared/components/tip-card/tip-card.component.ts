import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tip } from '../../../core/models/recipe.model';
import { MediaModalService } from '../../../core/services/media-modal.service';

@Component({
  selector: 'cs-tip-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tip-card cs-card" (click)="onCardClick()">
      <div class="tip-card__media">
        <img [src]="tip.image" [alt]="tip.title" loading="lazy" />
        @if (isPlayable) {
          <button
            type="button"
            class="tip-card__play"
            (click)="openModal($event)"
            [attr.aria-label]="'Play video: ' + tip.title"
          >
            <div class="tip-card__play-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </button>
        }
      </div>
      <div class="tip-card__body">
        <div class="tip-card__meta">
          <span class="badge badge-gold">{{ tip.category }}</span>
          @if (isPlayable) {
            <span class="tip-card__video-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              Watch Video
            </span>
          }
        </div>
        <h4>{{ tip.title }}</h4>
        <p>{{ tip.content }}</p>
      </div>
    </div>
  `,
  styleUrl: './tip-card.component.scss'
})
export class TipCardComponent {
  @Input({ required: true }) tip!: Tip;

  private mediaModal = inject(MediaModalService);

  get isPlayable(): boolean {
    return this.tip.type === 'video' && !!this.tip.videoUrl;
  }

  onCardClick(): void {
    if (this.isPlayable) {
      this.openModal();
    }
  }

  openModal(event?: Event): void {
    if (event) event.stopPropagation();
    this.mediaModal.openVideo(this.tip);
  }
}
