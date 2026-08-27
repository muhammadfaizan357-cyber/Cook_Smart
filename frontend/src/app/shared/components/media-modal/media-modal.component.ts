import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MediaModalService } from '../../../core/services/media-modal.service';

@Component({
  selector: 'cs-media-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- VIP Video Modal Popup for Tips -->
    @if (modal.activeTip(); as tip) {
      <div class="global-modal-backdrop" (click)="modal.close()">
        <div class="global-modal global-modal--video" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="global-modal__header">
            <div class="global-modal__title-box">
              <span class="badge badge-gold">{{ tip.category }} MASTER TIP</span>
              <h2>{{ tip.title }}</h2>
            </div>
            <button type="button" class="global-modal__close-btn" (click)="modal.close()" aria-label="Close video">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Video Player (Wide 16:9 Screen) -->
          <div class="global-modal__video-wrap">
            @if (modal.safeVideoUrl()) {
              <iframe
                class="global-modal__frame"
                [src]="modal.safeVideoUrl()"
                title="{{ tip.title }} video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            } @else {
              <div class="global-modal__fallback">
                <img [src]="tip.image" [alt]="tip.title" />
                <div class="global-modal__fallback-overlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p>Video playback is unavailable for this technique — review the culinary steps below.</p>
                </div>
              </div>
            }
          </div>

          <!-- Description / Chef Secret -->
          <div class="global-modal__body">
            <div class="technique-box">
              <div class="technique-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              </div>
              <div class="technique-details">
                <h4>Chef's Culinary Secret &amp; Technique:</h4>
                <p>{{ tip.content }}</p>
              </div>
            </div>
            <div class="global-modal__actions">
              <button type="button" class="btn btn-outline-gold" (click)="modal.close()">
                Close Video
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- VIP Large Category Image Lightbox Popup -->
    @if (modal.activeCategory(); as cat) {
      <div class="global-modal-backdrop" (click)="modal.close()">
        <div class="global-modal global-modal--category" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="global-modal__header">
            <div class="global-modal__title-box">
              <span class="badge badge-gold">{{ cat.name }} COLLECTION</span>
              <h2>{{ cat.name }} Culinary Showcase</h2>
            </div>
            <button type="button" class="global-modal__close-btn" (click)="modal.close()" aria-label="Close image">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Enlarged Image Container -->
          <div class="global-modal__image-wrap">
            <img [src]="cat.image" [alt]="cat.name" class="global-modal__image" />
            <div class="global-modal__image-overlay"></div>
          </div>

          <!-- Footer with Category Info & Navigation Action -->
          <div class="global-modal__body">
            <div class="cat-details">
              <h4>{{ cat.name }}</h4>
              <p>{{ cat.description }}</p>
            </div>
            <div class="global-modal__actions">
              <a
                [routerLink]="['/recipes']"
                [queryParams]="{ category: cat.id }"
                class="btn btn-primary"
                (click)="modal.close()"
              >
                <span>Explore All {{ cat.name }} Recipes</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .global-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: rgba(3, 3, 6, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: global-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes global-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .global-modal {
      width: 94vw;
      max-width: 960px;
      max-height: 92vh;
      background: #0d0d14;
      border-radius: 26px;
      border: 1.5px solid rgba(212, 175, 55, 0.45);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.98), 0 0 45px rgba(212, 175, 55, 0.22);
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      color: #ffffff;
      animation: global-pop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes global-pop {
      from { transform: scale(0.9) translateY(24px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .global-modal--category {
      max-width: 900px;
    }

    .global-modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 22px 28px;
      background: #08080c;
      border-bottom: 1.5px solid rgba(212, 175, 55, 0.25);
    }

    .global-modal__title-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .global-modal__title-box .badge {
      display: inline-flex;
      width: fit-content;
      max-width: max-content;
      align-self: flex-start;
      padding: 5px 14px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.06em;
      border-radius: var(--cs-radius-pill);
      white-space: nowrap;
    }
    .global-modal__title-box h2 {
      margin: 0;
      font-size: clamp(20px, 2.5vw, 26px);
      color: #ffffff;
      background: linear-gradient(135deg, #ffffff 40%, var(--cs-gold-300) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .global-modal__close-btn {
      background: #161622;
      border: 1.5px solid rgba(212, 175, 55, 0.35);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--cs-gold-400);
      transition: all 0.25s ease;
      flex-shrink: 0;
    }
    .global-modal__close-btn svg {
      width: 20px;
      height: 20px;
    }
    .global-modal__close-btn:hover {
      background: var(--cs-gradient-gold);
      color: #000000;
      border-color: var(--cs-gold-400);
      transform: scale(1.1);
      box-shadow: 0 0 16px rgba(212, 175, 55, 0.7);
    }

    /* Video Player */
    .global-modal__video-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000000;
    }
    .global-modal__frame {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    .global-modal__fallback {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .global-modal__fallback img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .global-modal__fallback-overlay {
      position: absolute;
      inset: 0;
      background: rgba(8, 8, 12, 0.88);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
      text-align: center;
    }
    .global-modal__fallback-overlay svg {
      width: 46px;
      height: 46px;
      color: var(--cs-gold-400);
    }
    .global-modal__fallback-overlay p {
      color: #dcdce6;
      font-size: 15px;
      margin: 0;
    }

    /* Category Image Showcase */
    .global-modal__image-wrap {
      position: relative;
      width: 100%;
      height: clamp(300px, 48vh, 480px);
      background: #000000;
      overflow: hidden;
    }
    .global-modal__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .global-modal__image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(13,13,20,0.95) 0%, rgba(13,13,20,0.15) 60%, transparent 100%);
    }

    /* Body & Footer */
    .global-modal__body {
      padding: 24px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      background: #0d0d14;
      border-top: 1px solid rgba(212, 175, 55, 0.15);
    }

    .technique-box {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    .technique-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(212, 175, 55, 0.15);
      border: 1.5px solid rgba(212, 175, 55, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--cs-gold-400);
      flex-shrink: 0;
    }
    .technique-icon svg {
      width: 22px;
      height: 22px;
    }
    .technique-details h4 {
      margin: 0 0 4px;
      font-size: 15px;
      color: var(--cs-gold-300);
    }
    .technique-details p {
      margin: 0;
      font-size: 14.5px;
      color: #c4c4d6;
      line-height: 1.6;
    }

    .cat-details h4 {
      margin: 0 0 6px;
      font-size: 20px;
      color: var(--cs-gold-300);
    }
    .cat-details p {
      margin: 0;
      font-size: 14.5px;
      color: #c4c4d6;
      line-height: 1.6;
    }

    .btn-outline-gold {
      padding: 11px 24px;
      border-radius: 12px;
      background: transparent;
      border: 1.5px solid var(--cs-gold-400);
      color: var(--cs-gold-300);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
    }
    .btn-outline-gold:hover {
      background: var(--cs-gradient-gold);
      color: #000000;
      box-shadow: 0 4px 18px rgba(212, 175, 55, 0.5);
    }

    @media (max-width: 720px) {
      .global-modal-backdrop {
        padding: 12px;
      }
      .global-modal__header {
        padding: 16px 20px;
      }
      .global-modal__body {
        flex-direction: column;
        align-items: stretch;
        padding: 20px;
      }
      .global-modal__actions {
        width: 100%;
      }
      .global-modal__actions .btn {
        width: 100%;
      }
    }
  `]
})
export class MediaModalComponent {
  modal = inject(MediaModalService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.modal.close();
  }
}
