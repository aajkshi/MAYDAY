import { Language } from './types';

export const translations = {
  en: {
    sidebar: {
      dash: 'Dash',
      tools: 'Tools',
      ai: 'AI Pilot',
      exit: 'Exit',
      dim: 'Dim',
      back: 'Back',
      lang: 'Lang',
      install: 'Install'
    },
    dashboard: {
      currentSpeed: 'Current Speed',
      gpsActive: 'GPS Active',
      gpsSearching: 'Searching GPS...',
      startDriving: 'Start Driving',
      googleMaps: 'Google Maps',
      notPlaying: 'Not Playing',
      connectBluetooth: 'Connect Bluetooth Audio',
      device: 'Device',
      status: 'Status',
      system: 'System',
      online: 'Online',
      cloudy: 'Cloudy',
      temp: '24°C'
    },
    maintenance: {
      title: 'System Maintenance',
      subtitle: 'Manual troubleshooting guides and ADB commands.',
      note: '*Note: As a web app, I cannot execute commands directly. Use ADB.',
      manualSteps: 'Manual Steps',
      adbCommand: 'ADB Command',
      copy: 'Copy Command',
      viewInstructions: 'View Instructions',
      warning: 'Warning: Clearing this data may require re-login.',
      actions: {
        gboard: { title: 'Fix Gboard Lag', desc: 'Clears storage and cache for the Google Keyboard app.' },
        playServices: { title: 'Reset Play Services', desc: 'Fixes download issues or login loops.' },
        maps: { title: 'Reset Google Maps', desc: 'Clears local map data to fix navigation glitches.' }
      }
    },
    assistant: {
      title: 'AI Co-Pilot',
      subtitle: 'Ask about app recommendations or technical support.',
      placeholder: 'Ask me anything about your car setup...',
      initialMessage: "Hello! I'm your ApplePie Co-Pilot. I can recommend apps or help troubleshoot.",
      suggestions: ["Suggest Music Apps", "Clear Cache Command", "Fix GPS", "ApplePie Settings"]
    }
  },
  zh: {
    sidebar: {
      dash: '儀表板',
      tools: '維護',
      ai: 'AI 助手',
      exit: '離開',
      dim: '亮度',
      back: '返回',
      lang: '語言',
      install: '安裝'
    },
    dashboard: {
      currentSpeed: '目前時速',
      gpsActive: 'GPS 已連線',
      gpsSearching: '搜尋 GPS 中...',
      startDriving: '開始導航',
      googleMaps: 'Google 地圖',
      notPlaying: '未播放',
      connectBluetooth: '請連接藍牙音訊',
      device: '裝置',
      status: '狀態',
      system: '系統',
      online: '線上',
      cloudy: '多雲',
      temp: '24°C'
    },
    maintenance: {
      title: '系統維護',
      subtitle: 'Android AI Box 的手動故障排除指南與 ADB 指令。',
      note: '*注意：Web 應用程式無法直接執行指令，請使用 ADB。',
      manualSteps: '手動步驟',
      adbCommand: 'ADB 指令',
      copy: '複製指令',
      viewInstructions: '查看教學',
      warning: '警告：清除此資料可能需要重新登入您的 Google 帳戶。',
      actions: {
        gboard: { title: '修復鍵盤卡頓', desc: '清除 Google Gboard 鍵盤的儲存空間與快取。' },
        playServices: { title: '重設 Play 服務', desc: '修復下載問題或登入迴圈。' },
        maps: { title: '重設 Google 地圖', desc: '清除地圖快取以修復導航錯誤。' }
      }
    },
    assistant: {
      title: 'AI 駕駛助手',
      subtitle: '詢問推薦應用程式或技術支援。',
      placeholder: '詢問關於您的車機設定...',
      initialMessage: "你好！我是你的 ApplePie 駕駛助手。我可以推薦好用的 APP 或協助排除故障。",
      suggestions: ["推薦音樂 APP", "清除快取指令", "修復 GPS", "ApplePie 設定"]
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];