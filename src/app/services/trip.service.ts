import { Injectable, signal, computed } from '@angular/core';

// 1. 定義主題介面
export interface Theme {
  id: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  fontHead: string; // 標題字體
  fontBody: string; // 內文字體
  backgroundImage: string; // 背景圖紋
}

// 2. 定義行程介面
export interface Trip {
  id: string; // 例如 'wbc2026'
  name: string; // 例如 '2026 WBC 經典賽'
  themeId: string; // 例如 'sports' (對應下方的 THEMES)
  startDate: string; // 用來計算倒數
  days: any[]; // 這裡放原本的 DayItinerary[]

  headerTitle: string; // 例如: "WBC 2026..."
  headerSubtitle: string; // 例如: "TOKYO / MIAMI..."
  headerBg: string; // 背景圖片網址
  countdownLabel: string; // 例如: "GAME START IN"
}

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

// 3. 預設主題庫 (CSS 樣板)
export const THEMES: Record<string, Theme> = {
  sports: {
    // WBC 熱血運動風
    id: 'sports',
    primary: '#0077BE',
    secondary: '#FF6B6B',
    accent: '#00C4B4',
    bg: '#F0F8FF',
    fontHead: "'Oswald', sans-serif",
    fontBody: "'Noto Sans TC', sans-serif",
    backgroundImage: 'radial-gradient(#e1eff9 1px, transparent 1px)',
  },
  kyoto: {
    // 京都日式禪風
    id: 'kyoto',
    primary: '#5D4037', // 深褐色
    secondary: '#C0392B', // 朱紅色 (鳥居)
    accent: '#8D6E63',
    bg: '#F5F5F5', // 米紙色
    fontHead: "'Noto Serif TC', serif", // 宋體/明體
    fontBody: "'Noto Sans TC', sans-serif",
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper-2.png")',
  },
  island: {
    // 海島度假風
    id: 'island',
    primary: '#009688', // 湖水綠
    secondary: '#FF9800', // 夕陽橘
    accent: '#FFEB3B', // 陽光黃
    bg: '#E0F7FA',
    fontHead: "'Montserrat', sans-serif", // 圓潤現代字體
    fontBody: "'Open Sans', sans-serif",
    backgroundImage: 'linear-gradient(to bottom right, #E0F7FA, #FFFFFF)',
  },
  // 1. 定向越野 (森林、等高線、橘白標誌)
  orienteering: {
    id: 'orienteering',
    primary: '#FF6600', // 檢查點標誌的亮橘色
    secondary: '#2E7D32', // 森林綠
    accent: '#5D4037', // 泥土褐
    bg: '#F1F8E9',
    fontHead: "'Roboto Condensed', sans-serif", // 像地圖數據般清晰
    fontBody: "'Roboto', sans-serif",
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/topo-map.png")', // 等高線紋理
  },
  // 2. 北海道火腿鬥士 (新球場 Es Con Field 風格 - 天空藍、黑、金)
  fighters: {
    id: 'fighters',
    primary: '#0085CA', // 北海道的天空藍 (Hokkaido Blue)
    secondary: '#000000', // 黑色力量
    accent: '#D4AF37', // 金色榮耀
    bg: '#E3F2FD',
    fontHead: "'Teko', sans-serif", // 強烈的運動字體
    fontBody: "'Noto Sans JP', sans-serif",
    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  // 3. 大滿貫網球 (溫布頓草地風 - 紫、綠、白)
  tennis: {
    id: 'tennis',
    primary: '#2A0052', // 溫布頓紫
    secondary: '#00703C', // 草地綠
    accent: '#CDE500', // 網球螢光綠
    bg: '#F9F9F9',
    fontHead: "'Playfair Display', serif", // 優雅經典
    fontBody: "'Open Sans', sans-serif",
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")', // 網球拍材質感
  },
  // 4. 澳洲墨爾本 (咖啡、塗鴉藝術、電車)
  melbourne: {
    id: 'melbourne',
    primary: '#3E2723', // 咖啡豆深褐
    secondary: '#78909C', // 城市灰藍
    accent: '#D84315', // 復古紅磚/塗鴉
    bg: '#ECEFF1',
    fontHead: "'Permanent Marker', cursive", // 街頭塗鴉手寫風
    fontBody: "'Lato', sans-serif",
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")',
  },
  // 5. 曼谷農曆新年 (唐人街霓虹夜色 - 紅、金、霓虹)
  'bkk-cny': {
    id: 'bkk-cny',
    primary: '#D50000', // 正紅
    secondary: '#FFD700', // 亮金
    accent: '#AA00FF', // 曼谷夜生活霓虹紫
    bg: '#121212', // 深色背景模式
    fontHead: "'Cinzel', serif", // 華麗襯線字體
    fontBody: "'Noto Sans TC', sans-serif",
    backgroundImage: 'linear-gradient(to bottom, #2c0000, #1a0000)',
  },
  // 1. O-ringen (瑞典定向越野五日賽)
  oringen: {
    id: 'oringen',
    primary: '#0055AA', // 瑞典藍
    secondary: '#FFD700', // 瑞典黃
    accent: '#2E7D32', // 森林綠
    bg: '#F9FBE7', // 淺草綠背景
    fontHead: "'Roboto Condensed', sans-serif", // 像地圖數據般清晰
    fontBody: "'Open Sans', sans-serif",
    backgroundImage: 'linear-gradient(to bottom, #e1f5fe, #f1f8e9)', // 藍天接綠地
  },

  // 2. 福岡 (Fukuoka - 屋台、豚骨拉麵)
  fukuoka: {
    id: 'fukuoka',
    primary: '#D32F2F', // 屋台燈籠紅
    secondary: '#1A1A1A', // 拉麵碗黑
    accent: '#FBC02D', // 麵條黃
    bg: '#FFF8E1', // 豚骨湯底白
    fontHead: "'M PLUS Rounded 1c', sans-serif", // 圓潤可愛的日文字體
    fontBody: "'Noto Sans JP', sans-serif",
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/sushi.png")',
  },

  // 3. 世壯運 (World Masters Games - 多彩、活力)
  wmg: {
    id: 'wmg',
    primary: '#9C27B0', // 活力紫
    secondary: '#00BCD4', // 運動青
    accent: '#FF4081', // 熱情粉
    bg: '#FAFAFA',
    fontHead: "'Montserrat', sans-serif", // 現代幾何字體
    fontBody: "'Roboto', sans-serif",
    backgroundImage:
      'linear-gradient(45deg, #f3e5f5 25%, #e0f7fa 25%, #e0f7fa 50%, #f3e5f5 50%, #f3e5f5 75%, #e0f7fa 75%, #e0f7fa 100%)', // 動感斜紋
  },

  // 4. 澳洲網球公開賽 (Aus Open - 藍色硬地、陽光)
  'aus-open': {
    id: 'aus-open',
    primary: '#0078D7', // AO Blue (球場藍)
    secondary: '#FFC107', // Melbourne Sun (太陽黃)
    accent: '#FFFFFF', // 線條白
    bg: '#E3F2FD',
    fontHead: "'Oswald', sans-serif",
    fontBody: "'Lato', sans-serif",
    backgroundImage: 'radial-gradient(circle, #ffffff 0%, #bbdefb 100%)',
  },

  // 5. 棒球 (Baseball - 通用經典棒球風格，紅線球)
  baseball: {
    id: 'baseball',
    primary: '#B71C1C', // 棒球縫線紅
    secondary: '#1B5E20', // 草皮綠
    accent: '#8D6E63', // 紅土/球棒色
    bg: '#F5F5F5',
    fontHead: "'Graduate', serif", // 大學運動字體
    fontBody: "'Roboto Slab', serif",
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")', // 類似球衣布料質感
  },
};

@Injectable({
  providedIn: 'root',
})
export class TripService {
  // 這裡存放 10 天的所有資料，以後改行程只要改這裡！
  private trips: Trip[] = [
    {
      id: '2026-03-WBC',
      name: '2026 WBC棒球經典賽',
      themeId: 'sports',
      startDate: '2026-03-05T00:00:00',
      headerTitle: '2026 WBC',
      headerSubtitle: '2026/02/26 - 2026/03/08',
      headerBg: 'assets/images/2026-03-WBC.jpeg',
      countdownLabel: 'TRAVEL START IN',
      days: [
        {
          id: 1,
          date: 'FEBRUARY 26 (木)',
          title: 'Flight TO Tokyo',
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
                color: 'var(--secondary-color)',
              },
            },
            { time: '14:00', title: '飯店 Check-in', desc: '東京巨蛋飯店', locationLink: '#' },
          ],
        },
        {
          id: 2,
          date: 'FEBRUARY 27 (金)',
          title: 'TOKYO',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 3,
          date: 'FEBRUARY 28 (土)',
          title: '青森',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 4,
          date: 'MARCH 01 (日)',
          title: '青森',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 5,
          date: 'MARCH 02 (月)',
          title: '奧入瀨',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 6,
          date: 'MARCH 03 (火)',
          title: '奧入瀨',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 7,
          date: 'MARCH 04 (水)',
          title: 'Back TO Tokyo',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 8,
          date: 'MARCH 05 (木)',
          title: '台灣 vs 澳洲',
          isGameDay: true,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 9,
          date: 'MARCH 06 (金)',
          title: '日本 vs 台灣',
          isGameDay: true,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 10,
          date: 'MARCH 07 (土)',
          title: '台灣 vs 捷克 & 南韓 vs 日本',
          isGameDay: true,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 11,
          date: 'MARCH 08 (日)',
          title: 'Back TO Taiwan',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
      ],
    },
    {
      id: '2026-03-Shodoshima',
      name: '2026 小豆島定向',
      themeId: 'orienteering',
      startDate: '2026-03-19T14:30:00',
      headerTitle: '2026 小豆島定向',
      headerSubtitle: '2026/03/19 - 2026/03/22',
      headerBg:
        'assets/images/2026-03-Shodoshima.jpg',
      countdownLabel: 'FLIGHT TAKEOFF IN',
      days: [
        { id: 1, title: '抵達關西', date: 'NOV 20', isGameDay: false, activities: [] },
        { id: 2, title: '清水寺參拜', date: 'NOV 21', isGameDay: false, activities: [] },
      ],
    },
    {
      id: '2026-04-Hokkaido',
      name: '2026 北海道棒球',
      themeId: 'fighters',
      startDate: '2026-04-02T16:30:00',
      headerTitle: '2026 Fighters',
      headerSubtitle: '2026/04/02 - 2026/04/06',
      headerBg:
        'assets/images/2026-04-Hokkaido.jpg',
      countdownLabel: 'FLIGHT TAKEOFF IN',
      days: [
        { id: 1, title: '抵達關西', date: 'NOV 20', isGameDay: false, activities: [] },
        { id: 2, title: '清水寺參拜', date: 'NOV 21', isGameDay: false, activities: [] },
      ],
    },
    {
      id: '2026-06-Fukuoka',
      name: '2026 福岡',
      themeId: 'fukuoka',
      startDate: '2026-06-18T00:00:00',
      headerTitle: '2026 Fukuoka',
      headerSubtitle: '2026/06/18 - 2026/06/21',
      headerBg:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
      countdownLabel: 'FLIGHT TAKEOFF IN',
      days: [
        { id: 1, title: '抵達關西', date: 'NOV 20', isGameDay: false, activities: [] },
        { id: 2, title: '清水寺參拜', date: 'NOV 21', isGameDay: false, activities: [] },
      ],
    },
    {
      id: '2026-07-Oringen',
      name: '2026 O-ringen',
      themeId: 'oringen',
      startDate: '2026-07-17T00:00:00',
      headerTitle: '2026 O-ringen',
      headerSubtitle: '2026/07/17 - 2026/07/27',
      headerBg:
        'assets/images/2026-07-Oringen.jpg',
      countdownLabel: 'FLIGHT TAKEOFF IN',
      days: [
        { id: 1, title: '抵達關西', date: 'NOV 20', isGameDay: false, activities: [] },
        { id: 2, title: '清水寺參拜', date: 'NOV 21', isGameDay: false, activities: [] },
      ],
    },
    {
      id: '2026-09-Baseball',
      name: '2026 棒球',
      themeId: 'baseball',
      startDate: '2026-09-24T00:00:00',
      headerTitle: 'KYOTO AUTUMN TRIP 2025',
      headerSubtitle: 'OSAKA / KYOTO / NARA',
      headerBg:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
      countdownLabel: 'FLIGHT TAKEOFF IN',
      days: [
        { id: 1, title: '抵達關西', date: 'NOV 20', isGameDay: false, activities: [] },
        { id: 2, title: '清水寺參拜', date: 'NOV 21', isGameDay: false, activities: [] },
      ],
    },
    {
      id: 'kyoto2025',
      name: '2025 京都賞楓行',
      themeId: 'aus-open',
      startDate: '2025-11-20T00:00:00',
      headerTitle: 'KYOTO AUTUMN TRIP 2025',
      headerSubtitle: 'OSAKA / KYOTO / NARA',
      headerBg:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
      countdownLabel: 'FLIGHT TAKEOFF IN',
      days: [
        { id: 1, title: '抵達關西', date: 'NOV 20', isGameDay: false, activities: [] },
        { id: 2, title: '清水寺參拜', date: 'NOV 21', isGameDay: false, activities: [] },
      ],
    },
  ];

  currentTripId = signal<string>('wbc2026');
  currentTrip = computed(() => this.trips.find((t) => t.id === this.currentTripId()));

  getTrips() {
    return this.trips;
  }

  getTripById(id: string) {
    return this.trips.find((t) => t.id === id);
  }

  getDay(tripId: string, dayId: number) {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    return trip.days.find((d) => d.id === dayId);
  }

  // ★★★ 核心功能：切換 CSS 變數 ★★★
  applyTheme(themeId: string) {
    const theme = THEMES[themeId] || THEMES['sports'];
    const root = document.documentElement.style;

    root.setProperty('--primary-color', theme.primary);
    root.setProperty('--secondary-color', theme.secondary);
    root.setProperty('--accent-color', theme.accent);
    root.setProperty('--bg-color', theme.bg);

    // 設定字體 (需確保 index.html 有引入 Google Fonts)
    document.body.style.fontFamily = theme.fontBody;
    // 設定背景
    document.body.style.backgroundImage = theme.backgroundImage;
    // 設定標題字體 (這比較特別，我們用全域變數存起來給 Component 用)
    root.setProperty('--header-font', theme.fontHead);
  }
}
