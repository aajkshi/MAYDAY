import React, { useState } from 'react';
import { MaintenanceAction, Language } from '../types';
import { getTranslation } from '../translations';
import { Trash2, AlertTriangle, Terminal, ChevronRight, X } from 'lucide-react';

interface MaintenanceProps {
  lang: Language;
}

const Maintenance: React.FC<MaintenanceProps> = ({ lang }) => {
  const [selectedAction, setSelectedAction] = useState<MaintenanceAction | null>(null);
  const t = getTranslation(lang).maintenance;

  const actions: MaintenanceAction[] = [
    {
      id: 'gboard-clean',
      title: t.actions.gboard.title,
      description: t.actions.gboard.desc,
      icon: 'trash',
      dangerLevel: 'low',
      steps: [
        'Open Settings',
        'Go to Apps > All Apps',
        'Find "Gboard"',
        'Select "Storage & Cache"',
        'Tap "Clear Storage"'
      ],
      adbCommand: 'pm clear com.google.android.inputmethod.latin'
    },
    {
      id: 'play-services-clean',
      title: t.actions.playServices.title,
      description: t.actions.playServices.desc,
      icon: 'cpu',
      dangerLevel: 'medium',
      steps: [
        'Open Settings',
        'Go to Apps > All Apps',
        'Find "Google Play Services"',
        'Select "Storage & Cache"',
        'Tap "Manage Space"',
        'Tap "Clear All Data"'
      ],
      adbCommand: 'pm clear com.google.android.gms'
    },
    {
      id: 'maps-cache',
      title: t.actions.maps.title,
      description: t.actions.maps.desc,
      icon: 'map',
      dangerLevel: 'low',
      steps: [
        'Open Settings',
        'Apps > Google Maps',
        'Storage & Cache',
        'Clear Storage'
      ],
      adbCommand: 'pm clear com.google.android.apps.maps'
    }
  ];

  return (
    <div className="flex-1 p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-slate-400">
          {t.subtitle}
          <span className="block text-amber-500 text-sm mt-2">
            {t.note}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => setSelectedAction(action)}
            className="bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-left transition-all hover:bg-slate-750 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              action.dangerLevel === 'medium' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/30 text-blue-400'
            }`}>
              {action.icon === 'trash' && <Trash2 size={24} />}
              {action.icon === 'cpu' && <Terminal size={24} />}
              {action.icon === 'map' && <Terminal size={24} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{action.description}</p>
            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              {t.viewInstructions} <ChevronRight size={16} className="ml-1" />
            </div>
          </button>
        ))}
      </div>

      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setSelectedAction(null)}
              className="absolute top-6 right-6 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-white mb-1">{selectedAction.title}</h3>
            <p className="text-slate-400 mb-6">{selectedAction.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Manual Steps */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h4 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  {t.manualSteps}
                </h4>
                <ol className="space-y-3">
                  {selectedAction.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-mono">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* ADB Command */}
              <div className="bg-black/40 rounded-2xl p-6 border border-slate-800 font-mono flex flex-col">
                 <h4 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                  <Terminal size={16} />
                  {t.adbCommand}
                </h4>
                <div className="bg-black p-4 rounded-lg border border-slate-800 text-slate-300 text-sm break-all mb-4 flex-1">
                  {selectedAction.adbCommand}
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(selectedAction.adbCommand)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-700"
                >
                  {t.copy}
                </button>
              </div>
            </div>
            
            {selectedAction.dangerLevel === 'medium' && (
              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-900/20 border border-amber-900/50 rounded-xl">
                 <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
                 <p className="text-amber-200/80 text-sm">
                   {t.warning}
                 </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;