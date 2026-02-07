import { Injectable } from '@angular/core';

export interface TransitInfo {
  type: 'FLIGHT' | 'TRAIN' | 'BUS' | 'CAR' | 'ARL';
  route: string;
  timeRange: string;
  duration: string;
  startStation: string;
  endStation: string;
  detail: string;
  price?: string;
  color?: string; // e.g. 'var(--secondary-color)'
}

export interface Activity {
  time: string;
  title: string;
  desc: string;
  locationLink?: string;
  transit?: TransitInfo; // 如果這是一個交通行程，就會有這個欄位
}

export interface DayItinerary {
  id: number;
  date: string;
  title: string;
  isGameDay: boolean; // 用來標記比賽日變色
  activities: Activity[];
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  // 這裡存放 10 天的所有資料，以後改行程只要改這裡！
  private itinerary: DayItinerary[] = [
    {
      id: 1,
      date: 'MARCH 05',
      title: '前進東京巨蛋',
      isGameDay: false,
      activities: [
        {
          time: '09:00',
          title: '桃園機場 TPE 出發',
          desc: '中華隊加油！穿著球衣集合',
          transit: {
            type: 'FLIGHT',
            route: 'TPE ➔ NRT',
            timeRange: '09:00 - 13:00',
            duration: '3 HR',
            startStation: '桃園機場 TPE',
            endStation: '東京成田 NRT',
            detail: '星宇航空 JX800',
            price: '已開票',
            color: 'var(--secondary-color)'
          }
        },
        { time: '14:00', title: '飯店 Check-in', desc: '東京巨蛋飯店', locationLink: '#' }
      ]
    },
    {
      id: 2,
      date: 'MARCH 06',
      title: '中華隊 vs 日本隊',
      isGameDay: true,
      activities: [
        { time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }
      ]
    }
    // ...以此類推加入 Day 3 到 Day 10
  ];

  getDays() {
    return this.itinerary;
  }

  getDayById(id: number) {
    return this.itinerary.find(day => day.id === id);
  }
}