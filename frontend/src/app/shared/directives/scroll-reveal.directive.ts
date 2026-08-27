import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Usage: <div csReveal>...</div>  or  <div csReveal="left" [csRevealDelay]="120">
 * Adds "reveal(-left|-right|-scale)" class immediately, then toggles "in-view"
 * once the element scrolls into the viewport (IntersectionObserver reveal effect).
 */
@Directive({
  selector: '[csReveal]',
  standalone: true
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  @Input('csReveal') set variant(v: 'up' | 'left' | 'right' | 'scale' | '') {
    this._variant = v || 'up';
  }
  _variant: 'up' | 'left' | 'right' | 'scale' = 'up';
  @Input() csRevealDelay = 0;

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const cls = this._variant === 'up' ? 'reveal' : `reveal-${this._variant}`;
    host.classList.add(cls);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => host.classList.add('in-view'), this.csRevealDelay);
            this.observer?.unobserve(host);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
