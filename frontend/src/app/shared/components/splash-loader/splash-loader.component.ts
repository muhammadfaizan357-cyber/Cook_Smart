import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cs-splash-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="splash-screen" [class.splash-screen--fading]="fading()">
      <!-- Background Luxury Golden Ambient Radiance -->
      <div class="splash-bg-glow"></div>
      <div class="splash-bg-glow splash-bg-glow--secondary"></div>

      <div class="splash-content">
        <!-- Logo with golden aura & double rotating celestial rings -->
        <div class="splash-logo-wrap">
          <div class="splash-ring splash-ring--1"></div>
          <div class="splash-ring splash-ring--2"></div>
          <div class="splash-glow"></div>
          <img src="assets/images/cooksmart-logo.png" alt="CookSmart Logo" class="splash-logo" />
        </div>

        <!-- Animated Golden Tagline -->
        <div class="splash-text">
          <span class="splash-badge">CULINARY EXCELLENCE</span>
          <h3>{{ message }}</h3>
          <p class="splash-sub">{{ subMessage }}</p>
        </div>

        <!-- Gold Shimmer Progress Bar -->
        <div class="splash-progress-container">
          <div class="splash-progress">
            <div class="splash-progress__bar" [style.width.%]="progress()">
              <div class="progress-glow-tip"></div>
            </div>
          </div>
          <div class="splash-progress-meta">
            <span class="splash-status-text">
              <span class="status-pulse-dot"></span>
              {{ progress() < 40 ? 'INITIALIZING ENGINE' : progress() < 85 ? 'PREPARING RECIPES' : 'READY' }}
            </span>
            <span class="splash-percent">{{ progress() }}%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .splash-screen {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: #060608;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    .splash-screen--fading {
      opacity: 0;
      transform: scale(1.05);
      pointer-events: none;
    }

    .splash-bg-glow {
      position: absolute;
      width: 550px;
      height: 550px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(6, 6, 8, 0) 70%);
      pointer-events: none;
      filter: blur(50px);
      animation: ambient-float 6s ease-in-out infinite alternate;
    }
    .splash-bg-glow--secondary {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(245, 215, 127, 0.1) 0%, rgba(6, 6, 8, 0) 70%);
      animation-delay: -3s;
    }
    @keyframes ambient-float {
      0% { transform: translate(-30px, -20px) scale(0.92); }
      100% { transform: translate(30px, 20px) scale(1.08); }
    }

    .splash-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 460px;
      padding: 36px;
    }

    .splash-logo-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140px;
      height: 140px;
      margin-bottom: 28px;
    }

    .splash-ring {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid rgba(212, 175, 55, 0.35);
      pointer-events: none;
    }
    .splash-ring--1 {
      inset: -14px;
      border-top-color: #d4af37;
      border-right-color: transparent;
      box-shadow: 0 0 16px rgba(212, 175, 55, 0.4);
      animation: spin-ring 3s linear infinite;
    }
    .splash-ring--2 {
      inset: -26px;
      border-bottom-color: #fae17d;
      border-left-color: transparent;
      opacity: 0.65;
      animation: spin-ring-rev 4.5s linear infinite;
    }
    @keyframes spin-ring {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes spin-ring-rev {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    .splash-glow {
      position: absolute;
      inset: -20px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, rgba(0, 0, 0, 0) 75%);
      border-radius: 50%;
      animation: pulse-glow 2.2s ease-in-out infinite alternate;
    }
    @keyframes pulse-glow {
      0% { transform: scale(0.92); opacity: 0.4; }
      100% { transform: scale(1.15); opacity: 0.9; }
    }

    .splash-logo {
      position: relative;
      z-index: 2;
      width: 110px;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 0 25px rgba(212, 175, 55, 0.7));
      animation: logo-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes logo-entrance {
      0% { transform: scale(0.8) translateY(10px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }

    .splash-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.22em;
      color: #000000;
      background: linear-gradient(135deg, #fae17d 0%, #d4af37 50%, #b8860b 100%);
      padding: 4px 14px;
      border-radius: 999px;
      margin-bottom: 12px;
      box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);
    }

    .splash-text h3 {
      font-size: 24px;
      margin: 0 0 8px;
      color: #ffffff;
      font-family: var(--cs-font-display, serif);
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #ffffff 40%, var(--cs-gold-300, #f5d77f) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .splash-sub {
      font-size: 13.5px;
      color: #9e9eb4;
      margin: 0 0 26px;
      line-height: 1.5;
    }

    .splash-progress-container {
      width: 280px;
      max-width: 80vw;
    }

    .splash-progress {
      width: 100%;
      height: 6px;
      background: #14141c;
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 10px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.9);
      position: relative;
    }
    .splash-progress__bar {
      height: 100%;
      background: linear-gradient(90deg, #b8860b 0%, #d4af37 50%, #fae17d 100%);
      box-shadow: 0 0 14px rgba(212, 175, 55, 0.85);
      border-radius: 999px;
      transition: width 0.15s ease-out;
      position: relative;
    }
    .progress-glow-tip {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 8px;
      background: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 8px #ffffff;
    }

    .splash-progress-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
    }
    .splash-status-text {
      color: #9e9eb4;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .status-pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 8px #4ade80;
      animation: pulse-dot 1.4s infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.5; }
    }
    .splash-percent {
      color: var(--cs-gold-400, #e5c158);
      font-variant-numeric: tabular-nums;
      font-size: 12.5px;
      font-weight: 800;
    }
  `]
})
export class SplashLoaderComponent implements OnInit {
  @Input() message = 'Welcome to CookSmart';
  @Input() subMessage = 'Preparing your luxury culinary experience…';
  @Input() minDuration = 1400; // ms

  @Output() completed = new EventEmitter<void>();

  progress = signal(0);
  fading = signal(false);

  ngOnInit(): void {
    const startTime = Date.now();
    const intervalTime = 25;
    const increment = 100 / (this.minDuration / intervalTime);

    const interval = setInterval(() => {
      const current = this.progress();
      if (current < 100) {
        const next = Math.min(100, Math.round(current + increment + Math.random() * 3));
        this.progress.set(next);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.fading.set(true);
          setTimeout(() => {
            this.completed.emit();
          }, 650);
        }, 150);
      }
    }, intervalTime);
  }
}
