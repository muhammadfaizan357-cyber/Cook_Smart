import { Injectable, signal, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Tip, Category } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class MediaModalService {
  private sanitizer = inject(DomSanitizer);

  activeTip = signal<Tip | null>(null);
  activeCategory = signal<Category | null>(null);
  safeVideoUrl = signal<SafeResourceUrl | null>(null);

  openVideo(tip: Tip): void {
    let url = tip.videoUrl || '';
    if (url) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        url += (url.includes('?') ? '&' : '?') + 'autoplay=1&rel=0&modestbranding=1';
      }
      this.safeVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    } else {
      this.safeVideoUrl.set(null);
    }
    this.activeTip.set(tip);
    this.activeCategory.set(null);
    document.body.style.overflow = 'hidden';
  }

  openCategory(cat: Category): void {
    this.activeCategory.set(cat);
    this.activeTip.set(null);
    this.safeVideoUrl.set(null);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.activeTip.set(null);
    this.activeCategory.set(null);
    this.safeVideoUrl.set(null);
    document.body.style.overflow = '';
  }
}
