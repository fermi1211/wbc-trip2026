import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core'; // 1. 加入 ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  // 2. 注入變更偵測器
  private cdr = inject(ChangeDetectorRef);
  
  targetDate = new Date("2026-03-05T00:00:00").getTime();
  timeLeft = { days: '00', hours: '00', mins: '00', secs: '00' };
  private intervalId: any;

  ngOnInit() {
    this.updateTimer();
    this.intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTimer() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      this.timeLeft = { days: '00', hours: '00', mins: '00', secs: '00' };
      if (this.intervalId) clearInterval(this.intervalId);
      this.cdr.markForCheck(); // 時間到也要通知一次
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timeLeft = {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      mins: minutes.toString().padStart(2, '0'),
      secs: seconds.toString().padStart(2, '0')
    };

    // ★★★ 3. 關鍵修正：手動通知 Angular 更新畫面 ★★★
    this.cdr.markForCheck();
    // 如果 markForCheck 沒用，請改試 this.cdr.detectChanges();
  }
}