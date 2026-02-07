import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('wbc-trip2026');

  touchStartX = 0;
  touchEndX = 0;

  constructor(private router: Router) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const distance = this.touchEndX - this.touchStartX;
    const minSwipe = 60;
    
    // 取得當前 URL 數字 (例如 /day/1 -> 1)
    const url = this.router.url;
    
    if (Math.abs(distance) > minSwipe) {
      if (url.includes('/day/')) {
        const currentDay = Number(url.split('/').pop());
        
        // 左滑 -> 下一天
        if (distance < 0 && currentDay < 10) {
          this.router.navigate(['/day', currentDay + 1]);
        }
        // 右滑 -> 上一天 (如果是 Day 1 就回首頁)
        else if (distance > 0) {
          if (currentDay > 1) {
            this.router.navigate(['/day', currentDay - 1]);
          } else {
            this.router.navigate(['/']);
          }
        }
      } else if (url === '/') {
          // 首頁左滑 -> Day 1
          if (distance < 0) this.router.navigate(['/day', 1]);
      }
    }
  }
}
