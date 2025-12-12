import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Maintenance from './components/Maintenance';
import Assistant from './components/Assistant';
import { ViewState, Language } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [history, setHistory] = useState<ViewState[]>([]);
  const [lang, setLang] = useState<Language>('zh'); 
  const [dimmerOpacity, setDimmerOpacity] = useState<number>(0);

  // Automatic Scaling Logic
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;

      let newFontSize = 16;

      if (isLandscape) {
        // For car head units (Landscape):
        // Scale up for high-res screens to maintain readability
        // Base: 1024px width -> ~16px
        // 1920px width -> ~24px
        // 800px width -> ~14px
        const calculated = width / 64; 
        newFontSize = Math.min(Math.max(12, calculated), 22);
      } else {
        // For Phones (Portrait):
        // Standard readable size, maybe slightly smaller for narrow screens
        newFontSize = width < 360 ? 14 : 16;
      }

      document.documentElement.style.fontSize = `${newFontSize}px`;
    };

    // Initial call
    handleResize();

    // Event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewChange = (newView: ViewState) => {
    if (newView === currentView) return;
    setHistory(prev => [...prev, currentView]);
    setCurrentView(newView);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const previousView = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentView(previousView);
  };

  const handleToggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleScreenWake = () => {
    if (dimmerOpacity >= 0.9) {
      setDimmerOpacity(0);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard lang={lang} />;
      case ViewState.MAINTENANCE:
        return <Maintenance lang={lang} />;
      case ViewState.ASSISTANT:
        return <Assistant lang={lang} />;
      default:
        return <Dashboard lang={lang} />;
    }
  };

  return (
    // Use h-full w-full with fixed positioning from index.html to prevent viewport shifting
    <div className="flex h-full w-full bg-slate-950 text-white overflow-hidden relative text-base transition-[font-size] duration-300 ease-in-out">
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        onBack={handleBack}
        canGoBack={history.length > 0}
        onBrightnessChange={setDimmerOpacity}
        lang={lang}
        onToggleLang={handleToggleLang}
      />
      
      {/* Main Content Area - flex-1 ensures it takes remaining width */}
      <main className="flex-1 h-full relative flex flex-col min-w-0">
        {/* Background ambient glow - fixed position to prevent scrolling issues */}
        <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50vh] h-[50vh] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
        
        {/* View Container */}
        <div className="relative z-10 h-full w-full overflow-hidden">
          {renderView()}
        </div>
      </main>

      {/* Dimmer Overlay */}
      <div 
        onClick={handleScreenWake}
        className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 ${dimmerOpacity > 0 ? 'block' : 'hidden'} ${dimmerOpacity >= 0.9 ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}`}
        style={{ opacity: dimmerOpacity }}
      >
        {dimmerOpacity >= 0.9 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm animate-pulse">
            Tap anywhere to wake
          </div>
        )}
      </div>
    </div>
  );
};

export default App;