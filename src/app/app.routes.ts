import { Routes } from '@angular/router';
import { Home } from './pages/home/home'; // 請自行建立 Home 元件 (儀表板)
import { DayDetail } from './pages/day-detail/day-detail';
import { Gear } from './pages/gear/gear'; // 請自行建立 Gear 元件
import { Notes } from './pages/notes/notes'; // 請自行建立 Notes 元件

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'day/:id', component: DayDetail }, // 動態路由！
  { path: 'gear', component: Gear },
  { path: 'notes', component: Notes },
  { path: '**', redirectTo: '' } // 找不到頁面導回首頁
];