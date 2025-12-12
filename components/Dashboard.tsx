import React, { useState, useEffect } from 'react';
import { Navigation, Map, Music, CloudRain, Clock } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface DashboardProps {
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ lang }) => {
  const [speed, setSpeed] = useState<number>(0);
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const t = getTranslation(lang).dashboard;

  useEffect(() => {
    // Clock setup
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Speedometer setup (Geolocation)
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // speed is in m/s, convert to km/h (multiply by 3.6)
        const speedKmh = position.coords.speed ? Math.round(position.coords.speed * 3.6) : 0;
        setSpeed(speedKmh);
      },
      (error) => console.error("GPS Error", error),
      { enableHighAccuracy: true }
    );

    return () => {
      clearInterval(interval);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [lang]);

  const openMapsDrivingMode = () => {
    window.location.href = "https://www.google.com/maps/dir/?api=1&destination=&travelmode=driving";
  };

  return (
    <div className="flex-1 p-4 lg:p-6 h-full overflow-y-auto">
      {/* 
         Responsive Grid System:
         - Mobile/Small Screens: Flex column or 1-2 columns
         - Large Car Screens: 12-column grid
         - auto-rows-min allows rows to adjust height based on content
         - Using rem-based min-heights (h-56, h-36, etc) to ensure scaling with root font size
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-min pb-20">
        
        {/* Speedometer Widget - Large */}
        <div className="md:col-span-2 lg:col-span-5 lg:row-span-4 min-h-[14rem] bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
          <span className="text-slate-400 text-sm font-semibold tracking-widest uppercase mb-2">{t.currentSpeed}</span>
          <div className="flex items-baseline">
            <span className="text-8xl lg:text-9xl font-bold text-white tabular-nums tracking-tighter drop-shadow-2xl">{speed}</span>
            <span className="text-xl lg:text-2xl text-blue-400 font-medium ml-2">km/h</span>
          </div>
          <div className="mt-8 flex gap-4 text-slate-400">
             <div className="flex items-center gap-1">
               <Navigation size={16} />
               <span className="text-xs">{t.gpsActive}</span>
             </div>
          </div>
        </div>

        {/* Clock & Weather Widget */}
        <div className="md:col-span-1 lg:col-span-4 lg:row-span-2 min-h-[9rem] bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-4xl lg:text-5xl font-bold text-white tracking-tight">{time}</span>
              <span className="text-slate-400 font-medium mt-1">{date}</span>
            </div>
            <Clock className="text-blue-500" size={32} />
          </div>
        </div>

        {/* Quick Action: Driving Mode */}
        <button 
          onClick={openMapsDrivingMode}
          className="md:col-span-1 lg:col-span-3 lg:row-span-2 min-h-[9rem] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-all rounded-3xl p-6 flex flex-col justify-center items-center group shadow-lg shadow-blue-900/50"
        >
          <div className="p-3 bg-white/20 rounded-full mb-2 group-hover:scale-110 transition-transform">
            <Map size={32} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">{t.startDriving}</span>
          <span className="text-blue-200 text-xs mt-1">{t.googleMaps}</span>
        </button>

        {/* Music Widget Placeholder */}
        <div className="md:col-span-2 lg:col-span-7 lg:row-span-2 min-h-[9rem] bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex items-center gap-6 backdrop-blur-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Music size={32} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white truncate">{t.notPlaying}</h3>
            <p className="text-slate-400 text-sm truncate">{t.connectBluetooth}</p>
            <div className="w-full h-1 bg-slate-700 mt-4 rounded-full overflow-hidden">
               <div className="w-1/3 h-full bg-blue-500"></div>
            </div>
          </div>
        </div>

         {/* Weather Small Widget */}
         <div className="md:col-span-1 lg:col-span-3 lg:row-span-2 min-h-[9rem] bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center backdrop-blur-sm">
            <CloudRain size={40} className="text-cyan-400 mb-2" />
            <span className="text-2xl font-bold">{t.temp}</span>
            <span className="text-slate-400 text-xs">{t.cloudy}</span>
         </div>

         {/* Bottom Info Bar */}
        <div className="md:col-span-2 lg:col-span-9 lg:row-span-2 min-h-[6rem] bg-slate-900/50 border border-slate-800 rounded-3xl p-4 flex items-center justify-between px-8">
          <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t.device}</span>
              <span className="font-semibold text-slate-300">ApplePie</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t.status}</span>
              <span className="font-semibold text-green-400">{t.online}</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t.system}</span>
              <span className="font-semibold text-slate-300">Android 11+</span>
          </div>
        </div>
        
        {/* Decorative / Other Apps */}
        <div className="md:col-span-2 lg:col-span-3 lg:row-span-2 min-h-[6rem] grid grid-cols-2 gap-3">
           {['YT', 'NF', 'SP', '+'].map((app) => (
             <div key={app} className="bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 hover:bg-slate-700 cursor-pointer h-16 lg:h-auto">
                <span className="text-xl font-bold text-slate-400">{app}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;