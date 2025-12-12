import React, { useState, useEffect } from 'react';
import { ViewState, Language } from '../types';
import { getTranslation } from '../translations';
import { LayoutDashboard, Wrench, MessageSquare, Power, ArrowLeft, Sun, Moon, Globe, Download } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onBack: () => void;
  canGoBack: boolean;
  onBrightnessChange: (opacity: number) => void;
  lang: Language;
  onToggleLang: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  onBack, 
  canGoBack,
  onBrightnessChange,
  lang,
  onToggleLang
}) => {
  const [showBrightness, setShowBrightness] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const t = getTranslation(lang).sidebar;

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const navItems = [
    { view: ViewState.DASHBOARD, icon: LayoutDashboard, label: t.dash },
    { view: ViewState.MAINTENANCE, icon: Wrench, label: t.tools },
    { view: ViewState.ASSISTANT, icon: MessageSquare, label: t.ai },
  ];

  const toggleBrightness = () => setShowBrightness(!showBrightness);

  const handleBrightnessSelect = (opacity: number) => {
    onBrightnessChange(opacity);
    setShowBrightness(false);
  };

  // Mobile: w-16 (64px), Desktop: w-24 (96px)
  return (
    <div className="w-16 md:w-24 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-4 md:py-6 gap-2 md:gap-4 h-full z-40 relative flex-shrink-0 transition-all duration-300">
      <div className="mb-2 flex flex-col items-center gap-2 md:gap-4">
        {/* Logo */}
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="font-bold text-lg md:text-xl">AP</span>
        </div>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
            canGoBack 
              ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-600' 
              : 'bg-transparent text-slate-700 cursor-not-allowed'
          }`}
        >
          <ArrowLeft size={18} className="md:w-5 md:h-5" />
        </button>
      </div>

      <div className="w-full h-px bg-slate-800 my-1"></div>

      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => onViewChange(item.view)}
          className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all duration-200 ${
            currentView === item.view
              ? 'bg-slate-700 text-blue-400 shadow-inner'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <item.icon size={24} strokeWidth={1.5} className="md:w-[28px] md:h-[28px]" />
          <span className="text-[9px] md:text-[10px] mt-1 font-medium text-center leading-tight px-1 hidden md:block">{item.label}</span>
        </button>
      ))}

      <div className="mt-auto flex flex-col gap-2 md:gap-4">
        {/* Install Button - Only visible if supported/promptable */}
        {deferredPrompt && (
          <button 
              onClick={handleInstallClick}
              className="flex flex-col items-center justify-center w-14 md:w-16 h-10 md:h-12 rounded-2xl text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition-colors animate-pulse"
            >
              <Download size={20} strokeWidth={1.5} className="md:w-[24px] md:h-[24px]" />
              <span className="text-[9px] md:text-[10px] mt-1 font-medium">{t.install}</span>
          </button>
        )}

        {/* Language Toggle */}
        <button 
            onClick={onToggleLang}
            className="flex flex-col items-center justify-center w-14 md:w-16 h-10 md:h-12 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Globe size={20} strokeWidth={1.5} className="md:w-[24px] md:h-[24px]" />
            <span className="text-[9px] md:text-[10px] mt-1 font-medium">{lang === 'en' ? 'EN' : '中文'}</span>
        </button>

        {/* Brightness Control */}
        <div className="relative">
          <button 
            onClick={toggleBrightness}
            className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-colors ${
              showBrightness ? 'bg-slate-800 text-yellow-400' : 'text-slate-400 hover:bg-slate-800 hover:text-yellow-200'
            }`}
          >
            <Sun size={24} strokeWidth={1.5} className="md:w-[28px] md:h-[28px]" />
            <span className="text-[9px] md:text-[10px] mt-1 font-medium hidden md:block">{t.dim}</span>
          </button>

          {/* Brightness Popup Menu */}
          {showBrightness && (
            <div className="absolute left-full bottom-0 ml-2 md:ml-4 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl flex flex-col gap-2 w-28 md:w-32 backdrop-blur-xl animate-in fade-in slide-in-from-left-4 z-50">
              <div className="text-xs text-slate-500 px-2 py-1 uppercase font-bold tracking-wider">{t.dim}</div>
              {[
                { label: '100%', opacity: 0 },
                { label: '80%', opacity: 0.2 },
                { label: '60%', opacity: 0.4 },
                { label: '40%', opacity: 0.6 },
                { label: 'OFF', opacity: 1.0 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleBrightnessSelect(opt.opacity)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors flex items-center gap-2 ${
                    opt.label === 'OFF' 
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                      : 'hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {opt.label === 'OFF' ? <Moon size={14} /> : <Sun size={14} className="opacity-70" />}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exit Button */}
        <button className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors">
          <Power size={24} strokeWidth={1.5} className="md:w-[28px] md:h-[28px]" />
          <span className="text-[9px] md:text-[10px] mt-1 font-medium hidden md:block">{t.exit}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;