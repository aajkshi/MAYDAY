export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MAINTENANCE = 'MAINTENANCE',
  ASSISTANT = 'ASSISTANT'
}

export type Language = 'en' | 'zh';

export interface MaintenanceAction {
  id: string;
  title: string;
  description: string;
  steps: string[];
  adbCommand: string;
  icon: 'trash' | 'settings' | 'map' | 'cpu';
  dangerLevel: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}